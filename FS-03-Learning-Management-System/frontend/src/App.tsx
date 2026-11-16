import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/CourseCatalog';
import { CoursePlayer } from './components/CoursePlayer';
import { LiveClassesView } from './components/LiveClassesView';
import { InstructorAnalytics } from './components/InstructorAnalytics';
import { MyCertificatesView } from './components/MyCertificatesView';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { Course, User, LiveSession, Quiz, Certificate } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'learning' | 'live' | 'instructor' | 'certificates'>('catalog');
  const [courses, setCourses] = useState<Course[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: number }>({});

  // Modals
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Auth
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-student-1',
    name: 'Hrithik Sarkar',
    email: 'student@test.com',
    role: 'STUDENT',
  });
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    loginAsRole('STUDENT');
    fetchLMSData();
  }, []);

  const loginAsRole = async (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    let email = 'student@test.com';
    if (role === 'INSTRUCTOR') email = 'instructor@nexvia.com';
    if (role === 'ADMIN') email = 'admin@nexvia.com';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setCurrentUser(data.user);
        if (role === 'INSTRUCTOR') setActiveTab('instructor');
        else if (role === 'ADMIN') setActiveTab('instructor');
        else setActiveTab('catalog');
      }
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const fetchLMSData = async () => {
    try {
      const [coursesRes, liveRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/live-classes'),
      ]);

      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        setCourses(cData);
        if (cData.length > 0) {
          // Pre-enroll student in course 1
          setEnrolledCourseIds([cData[0].id]);
          setCourseProgress({ [cData[0].id]: 66 });
        }
      }

      if (liveRes.ok) {
        const lData = await liveRes.json();
        setLiveSessions(lData);
      }
    } catch (err) {
      console.error('LMS data fetch error', err);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        setEnrolledCourseIds((prev) => [...prev, courseId]);
        setCourseProgress((prev) => ({ ...prev, [courseId]: 25 }));
        const targetCourse = courses.find((c) => c.id === courseId);
        if (targetCourse) handleOpenPlayer(targetCourse);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPlayer = async (course: Course) => {
    try {
      const res = await fetch(`/api/courses/${course.slug}`);
      if (res.ok) {
        const fullCourse = await res.json();
        setActiveCourse(fullCourse);
      } else {
        setActiveCourse(course);
      }
    } catch {
      setActiveCourse(course);
    }
  };

  const handleUpdateProgress = async (progress: number) => {
    if (!activeCourse) return;
    setCourseProgress((prev) => ({ ...prev, [activeCourse.id]: progress }));

    try {
      await fetch('/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: activeCourse.id,
          progressPercent: progress,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenQuiz = async () => {
    if (!activeCourse) return;
    try {
      const res = await fetch(`/api/quizzes/course/${activeCourse.id}`);
      if (res.ok) {
        const qData = await res.json();
        setActiveQuiz(qData);
        setIsQuizOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitQuiz = async (answers: { [qId: string]: number }) => {
    if (!activeQuiz) return { passed: false, score: 0 };
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.passed && activeCourse) {
          setCourseProgress((prev) => ({ ...prev, [activeCourse.id]: 100 }));
        }
        return json;
      }
      return { passed: false, score: 0 };
    } catch {
      return { passed: false, score: 0 };
    }
  };

  const handleOpenCertificate = async (existingCert?: Certificate) => {
    if (existingCert) {
      setActiveCertificate(existingCert);
      setIsCertOpen(true);
      return;
    }

    if (activeCourse) {
      const demoCert: Certificate = {
        id: 'cert-1',
        certificateNumber: 'NEX-CERT-940215',
        issueDate: new Date().toISOString(),
        grade: 'Excellence with High Distinction',
        course: activeCourse,
        user: { name: currentUser.name },
      };
      setActiveCertificate(demoCert);
      setIsCertOpen(true);
    }
  };

  const currentCourseProgress = activeCourse ? courseProgress[activeCourse.id] || 0 : 0;
  const isCurrentCourseCompleted = currentCourseProgress >= 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveCourse(null);
            setActiveTab(tab);
          }}
          currentUser={currentUser}
          switchRole={loginAsRole}
        />

        <main>
          {activeCourse ? (
            <CoursePlayer
              course={activeCourse}
              progressPercent={currentCourseProgress}
              onBack={() => setActiveCourse(null)}
              onUpdateProgress={handleUpdateProgress}
              onOpenQuiz={handleOpenQuiz}
              onOpenCertificate={() => handleOpenCertificate()}
              isCompleted={isCurrentCourseCompleted}
            />
          ) : (
            <>
              {activeTab === 'catalog' && (
                <CourseCatalog
                  courses={courses}
                  enrolledCourseIds={enrolledCourseIds}
                  onEnroll={handleEnroll}
                  onOpenPlayer={handleOpenPlayer}
                />
              )}

              {activeTab === 'learning' && (
                <CourseCatalog
                  courses={courses.filter((c) => enrolledCourseIds.includes(c.id))}
                  enrolledCourseIds={enrolledCourseIds}
                  onEnroll={handleEnroll}
                  onOpenPlayer={handleOpenPlayer}
                />
              )}

              {activeTab === 'live' && <LiveClassesView sessions={liveSessions} />}

              {activeTab === 'instructor' && (
                <InstructorAnalytics currentUser={currentUser} token={token} />
              )}

              {activeTab === 'certificates' && (
                <MyCertificatesView
                  token={token}
                  onOpenCertificateModal={(cert) => handleOpenCertificate(cert)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        quiz={activeQuiz}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmitQuiz={handleSubmitQuiz}
        onViewCertificate={() => handleOpenCertificate()}
      />

      {/* Certificate Modal */}
      <CertificateModal
        certificate={activeCertificate}
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
      />

      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nexvia Technologies Internship — Capstone Project FS-03 (LMS with Live Classes)</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <span>Candidate: Hrithik Sarkar</span>
            <span>•</span>
            <span>ID: NEX-INT-2026-1493</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
