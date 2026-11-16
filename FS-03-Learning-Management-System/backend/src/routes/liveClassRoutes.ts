import { Router } from 'express';
import { getLiveSessions, createLiveSession } from '../controllers/liveClassController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getLiveSessions);
router.post('/', authenticate, requireRole(['INSTRUCTOR', 'ADMIN']), createLiveSession);

export default router;
