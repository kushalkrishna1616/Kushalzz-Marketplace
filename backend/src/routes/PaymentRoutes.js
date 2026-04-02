import express from 'express';
import { createOrder, verifyPayment } from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

export default router;
