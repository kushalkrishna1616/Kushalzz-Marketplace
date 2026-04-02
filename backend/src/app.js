import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/ProductRoutes.js';
import aiRoutes from './routes/AIRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import addressRoutes from './routes/AddressRoutes.js';
import wishlistRoutes from './routes/WishlistRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('👟 Kushalzz Marketplace API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
