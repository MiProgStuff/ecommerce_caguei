import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { getOrdersHandler } from './orders.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getOrdersHandler);

export default router;
