import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getQuizByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const quiz = await prisma.quiz.findFirst({
      where: { courseId },
      include: {
        questions: true,
      },
    });

    if (!quiz) return res.status(404).json({ message: 'No quiz found for this course' });

    // Don't leak correctIndex to student in production quiz taking
    const sanitized = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.optionsJson),
      })),
    };

    return res.json(sanitized);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { quizId, answers } = req.body;
    // answers: { [questionId: string]: number }

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true, course: true },
    });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const submission = await prisma.quizSubmission.create({
      data: {
        userId,
        quizId,
        score,
        passed,
      },
    });

    // If passed, set course enrollment to 100% and generate certificate
    if (passed) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: quiz.courseId } },
        update: { progressPercent: 100, completed: true, completedAt: new Date() },
        create: { userId, courseId: quiz.courseId, progressPercent: 100, completed: true, completedAt: new Date() },
      });

      const certNo = `NEX-CERT-${Date.now().toString().slice(-6)}`;
      await prisma.certificate.upsert({
        where: { userId_courseId: { userId, courseId: quiz.courseId } },
        update: {},
        create: {
          certificateNumber: certNo,
          userId,
          courseId: quiz.courseId,
          grade: score >= 90 ? 'High Distinction' : 'Certified Professional',
        },
      });
    }

    return res.json({
      score,
      passed,
      passingScore: quiz.passingScore,
      submission,
      message: passed
        ? 'Congratulations! You passed and earned your verifiable certificate.'
        : 'Score below passing threshold. Review the material and try again.',
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to submit quiz' });
  }
};
