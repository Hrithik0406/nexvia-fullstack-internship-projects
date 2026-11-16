import { Router } from 'express';
import { getInstructorAnalytics } from '../controllers/instructorController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/analytics', authenticate, requireRole(['INSTRUCTOR', 'ADMIN']), getInstructorAnalytics);

export default router;
