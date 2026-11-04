import express from 'express';
import { getDashboardAnalytics, exportCSV } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(protect, roleGuard('admin'));

router.get('/analytics', getDashboardAnalytics);
router.get('/export/:type', exportCSV);

export default router;
