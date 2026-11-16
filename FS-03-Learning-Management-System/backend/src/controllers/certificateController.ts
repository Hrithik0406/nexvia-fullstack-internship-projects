import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getMyCertificates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const certs = await prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true, bio: true } },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { issueDate: 'desc' },
    });

    return res.json(certs);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { certificateNumber } = req.params;
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        course: {
          include: { instructor: { select: { name: true } } },
        },
        user: { select: { name: true } },
      },
    });

    if (!cert) {
      return res.status(404).json({ valid: false, message: 'Invalid certificate code' });
    }

    return res.json({
      valid: true,
      certificate: cert,
      message: 'Certificate is officially verified and recorded in the Nexvia registry.',
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Verification error' });
  }
};
