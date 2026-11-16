import React from 'react';
import { GraduationCap, Video, Award, BarChart3, BookOpen } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'learning' | 'live' | 'instructor' | 'certificates';
  setActiveTab: (tab: 'catalog' | 'learning' | 'live' | 'instructor' | 'certificates') => void;
  currentUser: User;
  switchRole: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  switchRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-indigo-950 text-indigo-200 text-xs py-1.5 px-4 text-center flex items-center justify-between">
        <span className="hidden sm:inline">Nexvia Capstone FS-03: Learning Management System with Live Classes</span>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-indigo-400 font-medium">Quick Evaluator Role:</span>
          {(['STUDENT', 'INSTRUCTOR', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentUser.role === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Nexvia<span className="text-indigo-600">Academy</span>
              </span>
              <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">
                LMS & LIVE
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'catalog'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Courses
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'learning'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Enrolled</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition relative ${
                activeTab === 'live'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              <span>Live Classes</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'certificates'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">Certificates</span>
            </button>

            {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
              <button
                onClick={() => setActiveTab('instructor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'instructor'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden md:inline">Instructor Hub</span>
              </button>
            )}

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden lg:block text-xs leading-tight">
                <p className="font-bold text-slate-800">{currentUser.name}</p>
                <span className="text-[10px] text-slate-400 font-medium uppercase">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
