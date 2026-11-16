import { Router } from 'express';
import { getMyCertificates, verifyCertificate } from '../controllers/certificateController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, getMyCertificates);
router.get('/verify/:certificateNumber', verifyCertificate);

export default router;
