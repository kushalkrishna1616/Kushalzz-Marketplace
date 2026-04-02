import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyId',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourTestKeySecret',
});

// @desc    Create a Razorpay order
// @route   POST /api/payment/create-order
// @access  Public (or Private if you want)
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount from frontend
    
    // Create an order in Razorpay
    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 1000}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Verify payment success
// @route   POST /api/payment/verify
// @access  Public (or Private)
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

    // Signature verification logic
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'TxPwAe8AbL6FEB0e3lm2WMYX');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature)
        return res.status(400).json({ msg: "Transaction signature mismatch!" });

    // 🏆 THE PAYMENT IS LEGIT -> SAVE THE ORDER!
    const orderItems = items.map(item => ({
       name: item.name,
       qty: item.quantity,
       image: item.image,
       price: item.price,
       product: item._id
    }));

    const order = new Order({
       user: req.user?._id || "64b0f1a23b8f2c001a0e3d2f", // Fallback or Guest mode
       orderItems,
       shippingAddress,
       totalPrice: totalAmount,
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
    console.error("Payment Verification Error:", error.message);
    res.status(500).send(error.message);
}
};
