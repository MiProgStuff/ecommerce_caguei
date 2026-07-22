import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getCartHandler,
  addToCartHandler,
  updateCartHandler,
  deleteCartItemHandler,
  clearCartHandler,
} from './cart.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getCartHandler);
router.post('/', addToCartHandler);
router.put('/:id', updateCartHandler);
router.delete('/:id', deleteCartItemHandler);
router.delete('/', clearCartHandler);

export default router;
