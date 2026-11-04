import express from 'express';
import { getCart, updateCart, mergeGuestCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCart);
router.put('/', protect, updateCart);
router.post('/merge', protect, mergeGuestCart);

export default router;
