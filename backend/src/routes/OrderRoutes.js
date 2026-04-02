import express from 'express';
import { getMyOrders, getOrderById } from '../controllers/OrderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;
