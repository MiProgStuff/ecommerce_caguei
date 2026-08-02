import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.middleware';
import { uploadImageHandler } from './upload.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, upload.single('image'), uploadImageHandler);

export default router;
