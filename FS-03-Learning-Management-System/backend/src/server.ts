import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import liveClassRoutes from './routes/liveClassRoutes';
import quizRoutes from './routes/quizRoutes';
import instructorRoutes from './routes/instructorRoutes';
import certificateRoutes from './routes/certificateRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// API health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Nexvia FS-03 Learning Management System API',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/certificates', certificateRoutes);

app.listen(PORT, () => {
  console.log(`🚀 FS-03 LMS Server running on http://localhost:${PORT}`);
});

export default app;
