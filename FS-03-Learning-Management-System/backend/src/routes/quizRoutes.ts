import { Router } from 'express';
import { getQuizByCourse, submitQuiz } from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/course/:courseId', getQuizByCourse);
router.post('/submit', authenticate, submitQuiz);

export default router;
