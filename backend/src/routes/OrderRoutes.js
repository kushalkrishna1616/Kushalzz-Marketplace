import express from 'express';
import { getMyOrders } from '../controllers/OrderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyOrders);

export default router;
