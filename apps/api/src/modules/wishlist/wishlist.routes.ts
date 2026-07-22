import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getWishlistHandler,
  addToWishlistHandler,
  removeFromWishlistHandler,
} from './wishlist.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getWishlistHandler);
router.post('/', addToWishlistHandler);
router.delete('/:productId', removeFromWishlistHandler);

export default router;
