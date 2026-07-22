import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getAddressesHandler,
  createAddressHandler,
  deleteAddressHandler,
} from './addresses.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getAddressesHandler);
router.post('/', createAddressHandler);
router.delete('/:id', deleteAddressHandler);

export default router;
