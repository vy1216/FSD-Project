import express from 'express';
import {
  getAdventures,
  getAdventureById,
  createAdventure,
  updateAdventure,
  deleteAdventure
} from '../controllers/adventureController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAdventures);
router.get('/:id', getAdventureById);
router.post('/', protect, adminOnly, createAdventure);
router.put('/:id', protect, adminOnly, updateAdventure);
router.delete('/:id', protect, adminOnly, deleteAdventure);

export default router;
