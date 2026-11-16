import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for FS-03 LMS with Live Classes...');

  // Clean existing records
  await prisma.certificate.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexvia.com',
      password: hashedPassword,
      name: 'Nexvia Academic Director',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@nexvia.com',
      password: hashedPassword,
      name: 'Dr. Aryan Sengupta',
      role: 'INSTRUCTOR',
      bio: 'Principal Distributed Systems Architect & Ex-Google Staff Engineer with 12+ years building low-latency microservices.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@test.com',
      password: hashedPassword,
      name: 'Hrithik Sarkar',
      role: 'STUDENT',
      bio: 'Aspiring Full Stack Engineer & Nexvia Intern.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Flagship Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Full-Stack Microservices & Event-Driven Architecture',
      slug: 'fullstack-microservices-event-driven',
      description: 'Master enterprise-grade backend systems using Node.js, TypeScript, Kafka message queues, Docker, and PostgreSQL with high concurrency.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      price: 89.99,
      level: 'Advanced',
      category: 'Backend Architecture',
      instructorId: instructor.id,
      published: true,
      modules: {
        create: [
          {
            title: 'Module 1: Domain-Driven Design & Microservice Decomposition',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: '1.1 Monolith vs Microservices: When and How to Decompose',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 22,
                  orderIndex: 1,
                  content: 'Learn boundaries of bounded contexts and API contract strategies.',
                },
                {
                  title: '1.2 Implementing Event Sourcing with Apache Kafka',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 34,
                  orderIndex: 2,
                  content: 'Message brokers, idempotency keys, and at-least-once delivery guarantees.',
                },
              ],
            },
          },
          {
            title: 'Module 2: Containerization & Cloud Deployment',
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: '2.1 Docker Multi-Stage Builds & Orchestration',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 28,
                  orderIndex: 1,
                  content: 'Optimizing image layers, volume caching, and multi-service docker-compose.',
                },
              ],
            },
          },
        ],
      },
      liveSessions: {
        create: [
          {
            title: 'Live Workshop: Real-time Distributed Transactions & Saga Patterns',
            description: 'Interactive system design breakdown and live Q&A session with Dr. Aryan Sengupta.',
            scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
            durationMinutes: 90,
            status: 'SCHEDULED',
            meetingRoomId: 'nexvia-live-saga-workshop',
          },
          {
            title: 'Office Hours & Code Review: High Throughput Optimizations',
            description: 'Bring your repository for direct architectural feedback and profiling.',
            scheduledAt: new Date(Date.now() - 3600000), // Active now
            durationMinutes: 60,
            status: 'LIVE',
            meetingRoomId: 'nexvia-office-hours-active',
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Modern React 19, TypeScript & High-Performance UI',
      slug: 'react-19-typescript-high-performance-ui',
      description: 'Deep dive into React 19 Actions, Server Components, client state management, and Tailwind CSS design systems.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      price: 69.99,
      level: 'Intermediate',
      category: 'Frontend Engineering',
      instructorId: instructor.id,
      published: true,
      modules: {
        create: [
          {
            title: 'Module 1: React 19 Architecture & Compiler',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: '1.1 Deep Dive into React Server Components (RSC)',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 18,
                  orderIndex: 1,
                },
                {
                  title: '1.2 Async Transitions & the useActionState Hook',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 25,
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
      liveSessions: {
        create: [
          {
            title: 'Interactive Code Jam: Building a Production Design System',
            description: 'Live coding session implementing accessible Tailwind UI components.',
            scheduledAt: new Date(Date.now() + 86400000 * 5),
            durationMinutes: 75,
            status: 'SCHEDULED',
            meetingRoomId: 'nexvia-react-jam',
          },
        ],
      },
    },
  });

  // 3. Create Quiz for Course 1
  await prisma.quiz.create({
    data: {
      title: 'Full-Stack Architecture Certification Exam',
      passingScore: 70,
      courseId: course1.id,
      questions: {
        create: [
          {
            question: 'What pattern is primarily used to manage distributed transactions across microservices without two-phase commit?',
            optionsJson: JSON.stringify([
              'Saga Pattern (Choreography or Orchestration)',
              'Singleton Pattern',
              'Observer Pattern',
              'Active Record Pattern',
            ]),
            correctIndex: 0,
          },
          {
            question: 'Why are Docker multi-stage builds recommended in production microservice deployments?',
            optionsJson: JSON.stringify([
              'They automatically run load testing in the cloud',
              'They minimize final image size and reduce attack surface by discarding build tools',
              'They replace Kubernetes pods',
              'They eliminate the need for environment variables',
            ]),
            correctIndex: 1,
          },
          {
            question: 'In Prisma ORM, which method allows executing multiple dependent queries safely within a single database transaction?',
            optionsJson: JSON.stringify([
              'prisma.$rawExecute()',
              'prisma.$sync()',
              'prisma.$transaction()',
              'prisma.$cascade()',
            ]),
            correctIndex: 2,
          },
        ],
      },
    },
  });

  // 4. Enroll Student in Course 1 with partial progress
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progressPercent: 66.0,
      completed: false,
    },
  });

  // Enroll Student in Course 2 with 100% completion & generated certificate
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      progressPercent: 100.0,
      completed: true,
      completedAt: new Date(),
    },
  });

  await prisma.certificate.create({
    data: {
      certificateNumber: 'NEX-CERT-940215',
      userId: student.id,
      courseId: course2.id,
      grade: 'Excellence with High Distinction',
    },
  });

  console.log('✅ FS-03 LMS database seeded successfully with courses, curriculum, quizzes, and certificates!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
