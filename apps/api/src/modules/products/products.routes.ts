import { Router } from 'express';
import { getProductsHandler, getProductBySlugHandler } from './products.controller';

const router = Router();

router.get('/', getProductsHandler);
router.get('/:slug', getProductBySlugHandler);

export default router;
