import { Router } from 'express';
import { checkUserHandler, listUsersHandler, updateUserRoleHandler } from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();

router.get('/check', checkUserHandler);

// Staff management — ADMIN can view (users:READ), only SUPER_ADMIN can
// promote/demote (users:UPDATE isn't granted to ADMIN in the seed, so the
// SUPER_ADMIN bypass in requirePermission is the only way through).
router.get('/', requireAuth, requirePermission('users', 'READ'), listUsersHandler);
router.patch('/:id/role', requireAuth, requirePermission('users', 'UPDATE'), updateUserRoleHandler);

export default router;
