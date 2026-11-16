import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderItemStatus,
} from '../controllers/orderController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/vendor-orders', authenticate, requireRole(['VENDOR', 'ADMIN']), getVendorOrders);
router.patch('/items/:id/status', authenticate, requireRole(['VENDOR', 'ADMIN']), updateOrderItemStatus);

export default router;
