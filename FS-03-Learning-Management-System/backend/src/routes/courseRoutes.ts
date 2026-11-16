import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  enrollCourse,
  updateProgress,
} from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/enroll', authenticate, enrollCourse);
router.post('/progress', authenticate, updateProgress);

export default router;
