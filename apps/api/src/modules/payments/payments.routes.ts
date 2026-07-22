import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { createPaymentIntentHandler } from './payments.controller';

const router = Router();

router.use(requireAuth);

router.post('/create-intent', createPaymentIntentHandler);

export default router;
