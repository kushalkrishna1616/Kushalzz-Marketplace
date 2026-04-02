import express from 'express';
import { signup, login, getMe, googleAuth, forgotPasswordSendOtp, forgotPasswordVerifyOtp } from '../controllers/AuthController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// PROTECT MIDDLEWARE
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

// FORGOT PASSWORD
router.post('/forgot-password/send-otp', forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', forgotPasswordVerifyOtp);

export default router;
