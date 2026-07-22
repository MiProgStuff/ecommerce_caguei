import { Router } from 'express';
import { getAnalyticsOverviewHandler } from './analytics.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/overview', requireAuth, getAnalyticsOverviewHandler);

export default router;
