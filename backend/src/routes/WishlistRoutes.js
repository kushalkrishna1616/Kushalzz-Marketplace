import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getWishlist, toggleWishlist } from '../controllers/WishlistController.js';

const router = express.Router();

// Reusable protect middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);

export default router;
