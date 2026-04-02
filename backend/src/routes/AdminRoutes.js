import express from 'express';
import { getAdminMetrics, getAllOrders, updateOrderStatus } from '../controllers/AdminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, admin, getAdminMetrics);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

export default router;
