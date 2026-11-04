import express from 'express';
import { updateProfile, changePassword, updateAddresses, getAllUsers, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/addresses', protect, updateAddresses);

// Admin user management
router.get('/', protect, roleGuard('admin'), getAllUsers);
router.put('/:id/role', protect, roleGuard('admin'), updateUserRole);

export default router;
