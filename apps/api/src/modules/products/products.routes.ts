import { Router } from 'express';
import {
  getProductsHandler,
  getProductByIdHandler,
  getProductBySlugHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from './products.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();

router.get('/', getProductsHandler);
router.get('/id/:id', getProductByIdHandler);
router.get('/:slug', getProductBySlugHandler);

// Admin protected routes
router.post('/', requireAuth, requirePermission('products', 'CREATE'), createProductHandler);
router.put('/:id', requireAuth, requirePermission('products', 'UPDATE'), updateProductHandler);
router.delete('/:id', requireAuth, requirePermission('products', 'DELETE'), deleteProductHandler);

export default router;
