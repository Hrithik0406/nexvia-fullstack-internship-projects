import React, { useState } from 'react';
import { Play, CheckCircle2, Circle, ArrowLeft, Award, HelpCircle, FileText } from 'lucide-react';
import { Course, Lesson } from '../types';

interface CoursePlayerProps {
  course: Course;
  progressPercent: number;
  onBack: () => void;
  onUpdateProgress: (progress: number) => void;
  onOpenQuiz: () => void;
  onOpenCertificate: () => void;
  isCompleted: boolean;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  progressPercent,
  onBack,
  onUpdateProgress,
  onOpenQuiz,
  onOpenCertificate,
  isCompleted,
}) => {
  // Extract all lessons
  const allLessons: Lesson[] = course.modules?.flatMap((m) => m.lessons) || [];
  const [activeLesson, setActiveLesson] = useState<Lesson>(allLessons[0] || {
    id: 'lesson-1',
    title: '1.1 Monolith vs Microservices: Architectural Foundations',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationMinutes: 24,
    orderIndex: 1,
    content: 'Comprehensive architectural trade-offs between monolithic codebases and distributed service meshes.',
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([allLessons[0]?.id || '']);

  const toggleLessonComplete = (lessonId: string) => {
    let next: string[];
    if (completedLessonIds.includes(lessonId)) {
      next = completedLessonIds.filter((id) => id !== lessonId);
    } else {
      next = [...completedLessonIds, lessonId];
    }
    setCompletedLessonIds(next);

    const calculated = allLessons.length > 0 ? Math.round((next.length / allLessons.length) * 100) : 50;
    onUpdateProgress(calculated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-indigo-600">{progressPercent}% Completed</span>
            <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quiz Action */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take Quiz</span>
          </button>

          {/* Certificate Action */}
          {isCompleted && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Video Player on Left, Curriculum Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video & Lesson Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video shadow-2xl relative flex items-center justify-center">
            {/* Embedded Video Player or Mock Stream */}
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-center p-8 text-white relative">
              <div className="w-20 h-20 rounded-full bg-indigo-600/30 flex items-center justify-center mb-4 ring-8 ring-indigo-600/10 cursor-pointer hover:scale-105 transition">
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              </div>
              <h2 className="text-xl font-black max-w-md">{activeLesson.title}</h2>
              <p className="text-xs text-slate-400 mt-2">
                Video Lesson • {activeLesson.durationMinutes} mins • High-Definition Stream
              </p>
              <span className="absolute bottom-4 right-4 text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300">
                Nexvia Player Engine v2.4
              </span>
            </div>
          </div>

          {/* Lesson Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{activeLesson.title}</h3>
              <button
                onClick={() => toggleLessonComplete(activeLesson.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  completedLessonIds.includes(activeLesson.id)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessonIds.includes(activeLesson.id)
                    ? 'Completed'
                    : 'Mark as Finished'}
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeLesson.content ||
                'In this session, we investigate design patterns, transaction boundaries, and optimal schema layout for low-latency web applications.'}
            </p>
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">Course Curriculum</h3>
            <span className="text-[11px] font-bold text-slate-400">
              {allLessons.length} Total Lessons
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {course.modules?.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
                  {mod.title}
                </h4>
                <div className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isDone = completedLessonIds.includes(lesson.id);
                    const isActive = activeLesson.id === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer text-xs transition ${
                          isActive
                            ? 'bg-indigo-50 border border-indigo-200 font-bold text-indigo-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 ml-2">
                          {lesson.durationMinutes}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Certification Quiz Callout */}
          <div className="pt-3 border-t border-slate-100 bg-indigo-50/70 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Earn Your Certification</span>
            </div>
            <p className="text-[11px] text-indigo-700 leading-snug">
              Pass the end-of-course assessment (70%+ passing threshold) to issue your official verifiable certificate.
            </p>
            <button
              onClick={onOpenQuiz}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Start Certification Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
