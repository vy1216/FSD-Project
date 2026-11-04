import express from 'express';
import { validateCoupon, getAllCoupons, createCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/', protect, roleGuard('admin'), getAllCoupons);
router.post('/', protect, roleGuard('admin'), createCoupon);

export default router;
