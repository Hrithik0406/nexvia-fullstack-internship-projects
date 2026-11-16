import { Router } from 'express';
import { getAdminMetrics } from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/metrics', authenticate, requireRole(['ADMIN']), getAdminMetrics);

export default router;
