import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getOrdersHandler,
  getOrderByIdHandler,
  fulfillOrderHandler,
} from './orders.controller';

import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', getOrdersHandler);
router.get('/:id', getOrderByIdHandler);
router.post('/:id/fulfill', requirePermission('orders', 'UPDATE'), fulfillOrderHandler);

export default router;
