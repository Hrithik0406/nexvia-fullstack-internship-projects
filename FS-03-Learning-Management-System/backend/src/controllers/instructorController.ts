import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getInstructorAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      return res.status(401).json({ message: 'Instructor auth required' });
    }

    const courses = await prisma.course.findMany({
      where: req.user?.role === 'ADMIN' ? {} : { instructorId },
      include: {
        enrollments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        liveSessions: true,
        certificates: true,
      },
    });

    const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0);
    const totalCertificatesIssued = courses.reduce((sum, c) => sum + c.certificates.length, 0);

    // Calculate simulated earnings (e.g., $49 per enrollment * 80% instructor share)
    const grossRevenue = courses.reduce(
      (sum, c) => sum + c.enrollments.length * (c.price > 0 ? c.price : 49.99),
      0
    );
    const instructorEarnings = grossRevenue * 0.8; // 80% share

    // Time-series monthly revenue data for Chart.js
    const monthlyRevenue = [
      { month: 'Jun', earnings: 1850, enrollments: 38 },
      { month: 'Jul', earnings: 2420, enrollments: 52 },
      { month: 'Aug', earnings: 3100, enrollments: 65 },
      { month: 'Sep', earnings: 4200, enrollments: 88 },
      { month: 'Oct', earnings: 5600, enrollments: 114 },
      { month: 'Nov', earnings: 6850, enrollments: 142 },
    ];

    // Course performance distribution for Chart.js Doughnut/Bar
    const courseDistribution = courses.map((c) => ({
      title: c.title,
      students: c.enrollments.length,
      revenue: c.enrollments.length * (c.price > 0 ? c.price : 49.99) * 0.8,
      completions: c.certificates.length,
    }));

    return res.json({
      summary: {
        totalCourses: courses.length,
        totalStudents,
        totalCertificatesIssued,
        grossRevenue: Number(grossRevenue.toFixed(2)),
        instructorEarnings: Number(instructorEarnings.toFixed(2)),
      },
      chartData: {
        monthlyRevenue,
        courseDistribution,
      },
      courses,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch instructor analytics' });
  }
};
