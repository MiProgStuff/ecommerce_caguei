import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getOrdersHandler,
  getOrderByIdHandler,
  fulfillOrderHandler,
  cancelOrderHandler,
} from './orders.controller';

import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', getOrdersHandler);
router.get('/:id', getOrderByIdHandler);
router.post('/:id/fulfill', requirePermission('orders', 'UPDATE'), fulfillOrderHandler);
router.post('/:id/cancel', requirePermission('orders', 'UPDATE'), cancelOrderHandler);

export default router;
