import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getLiveSessions = async (_req: Request, res: Response) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            instructor: { select: { name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
    return res.json(sessions);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch live sessions' });
  }
};

export const createLiveSession = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, scheduledAt, durationMinutes, courseId } = req.body;
    const session = await prisma.liveSession.create({
      data: {
        title,
        description,
        scheduledAt: new Date(scheduledAt || Date.now() + 3600000),
        durationMinutes: parseInt(durationMinutes, 10) || 60,
        meetingRoomId: `nexvia-room-${Date.now().toString().slice(-4)}`,
        courseId,
        status: 'SCHEDULED',
      },
    });
    return res.status(201).json(session);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to schedule live class' });
  }
};
