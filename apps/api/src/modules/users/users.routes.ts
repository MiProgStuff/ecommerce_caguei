import { Router } from 'express';
import { checkUserHandler } from './users.controller';

const router = Router();

router.get('/check', checkUserHandler);

export default router;
