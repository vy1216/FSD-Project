import express from 'express';
import {
  getStays,
  getStayById,
  createStay,
  updateStay,
  deleteStay
} from '../controllers/stayController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStays);
router.get('/:id', getStayById);
router.post('/', protect, adminOnly, createStay);
router.put('/:id', protect, adminOnly, updateStay);
router.delete('/:id', protect, adminOnly, deleteStay);

export default router;
