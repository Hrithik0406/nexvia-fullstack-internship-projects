import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.post('/', authenticate, requireRole(['VENDOR', 'ADMIN']), createProduct);
router.put('/:id', authenticate, requireRole(['VENDOR', 'ADMIN']), updateProduct);
router.delete('/:id', authenticate, requireRole(['VENDOR', 'ADMIN']), deleteProduct);

export default router;
