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

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://nexvia-fs03-api.onrender.com';

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Microservices & Event-Driven Architecture',
    slug: 'fullstack-microservices-event-driven',
    description: 'Master enterprise-grade backend systems using Node.js, TypeScript, Kafka message queues, Docker, and PostgreSQL with high concurrency.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    price: 89.99,
    level: 'Advanced',
    category: 'Backend Architecture',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Aryan Sengupta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Principal Distributed Systems Architect & Ex-Google Staff Engineer.',
    },
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Domain-Driven Design & Microservice Decomposition',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-1',
            title: '1.1 Monolith vs Microservices: Architectural Foundations',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 22,
            orderIndex: 1,
            content: 'Learn boundaries of bounded contexts and API contract strategies.',
          },
          {
            id: 'les-2',
            title: '1.2 Implementing Event Sourcing with Apache Kafka',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 34,
            orderIndex: 2,
            content: 'Message brokers, idempotency keys, and at-least-once delivery guarantees.',
          },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Containerization & Cloud Deployment',
        orderIndex: 2,
        lessons: [
          {
            id: 'les-3',
            title: '2.1 Docker Multi-Stage Builds & Orchestration',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 28,
            orderIndex: 1,
            content: 'Optimizing image layers, volume caching, and multi-service docker-compose.',
          },
        ],
      },
    ],
    _count: { enrollments: 94, modules: 2, liveSessions: 2 },
  },
  {
    id: 'course-2',
    title: 'Modern React 19, TypeScript & High-Performance UI',
    slug: 'react-19-typescript-high-performance-ui',
    description: 'Deep dive into React 19 Actions, Server Components, client state management, and Tailwind CSS design systems.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    price: 69.99,
    level: 'Intermediate',
    category: 'Frontend Engineering',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Aryan Sengupta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: React 19 Architecture & Compiler',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-2-1',
            title: '1.1 Deep Dive into React Server Components (RSC)',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 18,
            orderIndex: 1,
          },
        ],
      },
    ],
    _count: { enrollments: 62, modules: 1, liveSessions: 1 },
  },
];

const INITIAL_SESSIONS: LiveSession[] = [
  {
    id: 'session-1',
    title: 'Live Workshop: Real-time Distributed Transactions & Saga Patterns',
    description: 'Interactive system design breakdown and live Q&A session with Dr. Aryan Sengupta.',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationMinutes: 90,
    status: 'SCHEDULED',
    meetingRoomId: 'nexvia-live-saga-workshop',
  },
  {
    id: 'session-2',
    title: 'Office Hours & Code Review: High Throughput Optimizations',
    description: 'Bring your repository for direct architectural feedback and profiling.',
    scheduledAt: new Date().toISOString(),
    durationMinutes: 60,
    status: 'LIVE',
    meetingRoomId: 'nexvia-office-hours-active',
  },
];

const DEMO_QUIZ: Quiz = {
  id: 'quiz-1',
  title: 'Full-Stack Architecture Certification Exam',
  passingScore: 70,
  questions: [
    {
      id: 'q-1',
      question: 'What pattern is primarily used to manage distributed transactions across microservices without two-phase commit?',
      options: [
        'Saga Pattern (Choreography or Orchestration)',
        'Singleton Pattern',
        'Observer Pattern',
        'Active Record Pattern',
      ],
    },
    {
      id: 'q-2',
      question: 'Why are Docker multi-stage builds recommended in production microservice deployments?',
      options: [
        'They automatically run load testing in the cloud',
        'They minimize final image size and reduce attack surface by discarding build tools',
        'They replace Kubernetes pods',
        'They eliminate the need for environment variables',
      ],
    },
    {
      id: 'q-3',
      question: 'In Prisma ORM, which method allows executing multiple dependent queries safely within a single database transaction?',
      options: [
        'prisma.$rawExecute()',
        'prisma.$sync()',
        'prisma.$transaction()',
        'prisma.$cascade()',
      ],
    },
  ],
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'learning' | 'live' | 'instructor' | 'certificates'>('catalog');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(INITIAL_SESSIONS);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-1']);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: number }>({ 'course-1': 66 });

  // Modals
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(DEMO_QUIZ);
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
  const [token, setToken] = useState<string>('demo-token');

  useEffect(() => {
    loginAsRole('STUDENT');
    fetchLMSData();
  }, []);

  const loginAsRole = async (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    let email = 'student@test.com';
    let name = 'Hrithik Sarkar';
    if (role === 'INSTRUCTOR') {
      email = 'instructor@nexvia.com';
      name = 'Dr. Aryan Sengupta';
    } else if (role === 'ADMIN') {
      email = 'admin@nexvia.com';
      name = 'Nexvia Academic Director';
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setCurrentUser(data.user);
      } else {
        setCurrentUser({ id: `user-${role.toLowerCase()}`, name, email, role });
      }
    } catch {
      setCurrentUser({ id: `user-${role.toLowerCase()}`, name, email, role });
    }

    if (role === 'INSTRUCTOR') setActiveTab('instructor');
    else if (role === 'ADMIN') setActiveTab('instructor');
    else setActiveTab('catalog');
  };

  const fetchLMSData = async () => {
    try {
      const [coursesRes, liveRes] = await Promise.all([
        fetch(`${API_BASE}/api/courses`),
        fetch(`${API_BASE}/api/live-classes`),
      ]);

      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        if (cData && cData.length > 0) setCourses(cData);
      }

      if (liveRes.ok) {
        const lData = await liveRes.json();
        if (lData && lData.length > 0) setLiveSessions(lData);
      }
    } catch {
      // Keep rich initial fallback
    }
  };

  const handleEnroll = async (courseId: string) => {
    setEnrolledCourseIds((prev) => [...prev, courseId]);
    setCourseProgress((prev) => ({ ...prev, [courseId]: 25 }));
    const target = courses.find((c) => c.id === courseId);
    if (target) handleOpenPlayer(target);
  };

  const handleOpenPlayer = (course: Course) => {
    setActiveCourse(course);
  };

  const handleUpdateProgress = (progress: number) => {
    if (!activeCourse) return;
    setCourseProgress((prev) => ({ ...prev, [activeCourse.id]: progress }));
  };

  const handleOpenQuiz = () => {
    setActiveQuiz(DEMO_QUIZ);
    setIsQuizOpen(true);
  };

  const handleSubmitQuiz = async (answers: { [qId: string]: number }) => {
    if (activeCourse) {
      setCourseProgress((prev) => ({ ...prev, [activeCourse.id]: 100 }));
    }
    return { passed: true, score: 100 };
  };

  const handleOpenCertificate = (existingCert?: Certificate) => {
    if (existingCert) {
      setActiveCertificate(existingCert);
    } else if (activeCourse) {
      setActiveCertificate({
        id: 'cert-1',
        certificateNumber: 'NEX-CERT-940215',
        issueDate: new Date().toISOString(),
        grade: 'Excellence with High Distinction',
        course: activeCourse,
        user: { name: currentUser.name },
      });
    }
    setIsCertOpen(true);
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

      <QuizModal
        quiz={activeQuiz}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmitQuiz={handleSubmitQuiz}
        onViewCertificate={() => handleOpenCertificate()}
      />

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
