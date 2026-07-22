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

const router = Router();

router.get('/', getProductsHandler);
router.get('/id/:id', getProductByIdHandler);
router.get('/:slug', getProductBySlugHandler);

// Admin protected routes
router.post('/', requireAuth, createProductHandler);
router.put('/:id', requireAuth, updateProductHandler);
router.delete('/:id', requireAuth, deleteProductHandler);

export default router;
