import express from 'express';
import { createBooking, getMyBookings, getAllBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, adminOnly, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
