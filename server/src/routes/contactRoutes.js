import express from 'express';
import { submitContact, getContactMessages, updateMessageStatus } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, roleGuard('admin'), getContactMessages);
router.put('/:id/status', protect, roleGuard('admin'), updateMessageStatus);

export default router;
