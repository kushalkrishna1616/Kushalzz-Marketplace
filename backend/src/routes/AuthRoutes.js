import express from 'express';
import { signup, login, getMe, googleAuth, forgotPasswordSendOtp, forgotPasswordVerifyOtp } from '../controllers/AuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

// FORGOT PASSWORD
router.post('/forgot-password/send-otp', forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', forgotPasswordVerifyOtp);

export default router;
