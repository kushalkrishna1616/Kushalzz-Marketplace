import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RtAEhhoLIQ49vG',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'TxPwAe8AbL6FEB0e3lm2WMYX',
});

// @desc    Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 100000)}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred during order creation.");
    res.json(order);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).send(error.message);
  }
};

// @desc    Verify payment success
export const verifyPayment = async (req, res) => {
  try {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        shippingAddress,
        items,
        totalAmount
    } = req.body;

    // 1. Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET || 'TxPwAe8AbL6FEB0e3lm2WMYX';
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      console.warn("Signature mismatch on checkout.");
      return res.status(400).json({ msg: "Transaction signature mismatch!" });
    }

    // 2. Map items to Order Schema
    const orderItems = items.map(item => ({
       name: item.name,
       qty: Number(item.quantity),
       image: item.image,
       price: Number(item.price),
       product: item._id
    }));

    // 3. Save Order to Database
    const order = new Order({
       user: req.user?._id || "64b0f1a23b8f2c001a0e3d2f", // Fallback guest
       orderItems,
       shippingAddress,
       totalPrice: totalAmount,
       paymentMethod: 'Razorpay',
       isPaid: true,
       paidAt: Date.now(),
       paymentResult: {
          id: razorpay_payment_id,
          status: "success",
          update_time: Date.now().toString(),
       }
    });

    const savedOrder = await order.save();

    res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        savedOrder
    });
} catch (error) {
    console.error("Payment Verification Internal Error:", error.message);
    res.status(500).send(error.message);
}
};
