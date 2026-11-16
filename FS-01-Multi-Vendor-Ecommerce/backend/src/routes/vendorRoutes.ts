import { Router } from 'express';
import { getVendors, getVendorDashboard } from '../controllers/vendorController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getVendors);
router.get('/dashboard', authenticate, requireRole(['VENDOR', 'ADMIN']), getVendorDashboard);

export default router;
