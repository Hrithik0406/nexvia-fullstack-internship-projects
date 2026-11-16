import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { category, level, search } = req.query;
    const where: any = { published: true };

    if (category) where.category = String(category);
    if (level) where.level = String(level);
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        _count: { select: { enrollments: true, modules: true, liveSessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(courses);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

export const getCourseBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
          },
        },
        liveSessions: {
          orderBy: { scheduledAt: 'asc' },
        },
        quizzes: {
          include: {
            questions: true,
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.json(course);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch course details' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Please login to enroll' });

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      return res.json({ message: 'Already enrolled', enrollment: existing });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progressPercent: 25.0, // Starter progress
      },
    });

    return res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to enroll in course' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { courseId, progressPercent } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const isCompleted = progressPercent >= 100;

    const enrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        progressPercent: Math.min(100, Math.max(0, progressPercent)),
        completed: isCompleted,
        ...(isCompleted && { completedAt: new Date() }),
      },
    });

    // If 100% completed, auto-issue certificate if not exists
    if (isCompleted) {
      const existingCert = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!existingCert) {
        const certNo = `NEX-CERT-${Date.now().toString().slice(-6)}`;
        await prisma.certificate.create({
          data: {
            certificateNumber: certNo,
            userId,
            courseId,
            grade: 'Excellence with Honors',
          },
        });
      }
    }

    return res.json({ message: 'Progress updated', enrollment });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update progress' });
  }
};
