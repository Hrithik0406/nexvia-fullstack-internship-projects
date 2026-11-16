export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatarUrl?: string;
  bio?: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  content?: string;
  orderIndex: number;
}

export interface Module {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  meetingRoomId: string;
  course?: {
    id: string;
    title: string;
    thumbnail: string;
    instructor?: { name: string; avatarUrl?: string };
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  level: string;
  category: string;
  instructor?: {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  modules?: Module[];
  liveSessions?: LiveSession[];
  quizzes?: Quiz[];
  _count?: {
    enrollments: number;
    modules: number;
    liveSessions: number;
  };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  completed: boolean;
  course?: Course;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  issueDate: string;
  grade: string;
  course: Course;
  user: {
    name: string;
  };
}
