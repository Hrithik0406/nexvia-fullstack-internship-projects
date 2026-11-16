import React, { useState } from 'react';
import { BookOpen, Users, Clock, ArrowRight, CheckCircle2, Sparkles, Video } from 'lucide-react';
import { Course } from '../types';

interface CourseCatalogProps {
  courses: Course[];
  enrolledCourseIds: string[];
  onEnroll: (courseId: string) => void;
  onOpenPlayer: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  enrolledCourseIds,
  onEnroll,
  onOpenPlayer,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filtered = courses.filter((c) =>
    selectedLevel === 'All' ? true : c.level === selectedLevel
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Accredited Project-Based Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Learn Software Architecture from Engineering Leads.
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Self-paced video modules, weekly interactive live classes with screen sharing, practical quizzes, and verifiable industry certificates.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedLevel === lvl
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {lvl} Levels
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {course.level}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor row */}
                  {course.instructor && (
                    <div className="flex items-center gap-2.5 pt-2">
                      <img
                        src={course.instructor.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {course.instructor.name}
                      </span>
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      {course._count?.modules || 2} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-rose-500" />
                      Live Included
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-slate-900">
                    ${course.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Lifetime Access</span>
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => onOpenPlayer(course)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Open Course</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onEnroll(course.id)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
