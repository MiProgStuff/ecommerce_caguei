import { Router } from 'express';
import { getAnalyticsOverviewHandler } from './analytics.controller';
import { requireAuth } from '../../middleware/auth.middleware';

import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();

router.get('/overview', requireAuth, requirePermission('analytics', 'READ'), getAnalyticsOverviewHandler);

export default router;
