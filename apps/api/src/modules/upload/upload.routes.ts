import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.middleware';
import { uploadImageHandler } from './upload.controller';

import { requirePermission } from '../../middleware/permission.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, requirePermission('products', 'CREATE'), upload.single('image'), uploadImageHandler);

export default router;
