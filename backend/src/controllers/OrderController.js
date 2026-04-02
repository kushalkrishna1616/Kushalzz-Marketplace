import Order from '../models/Order.js';

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Map backend model to frontend expected fields
    const mappedOrders = orders.map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      status: order.isPaid ? 'PAID' : 'PLACED',
      items: order.orderItems.map(item => ({
        name: item.name,
        quantity: item.qty,
        image: item.image,
        price: item.price
      })),
      address: order.shippingAddress,
      total: order.totalPrice
    }));

    res.json(mappedOrders);
  } catch (error) {
    console.error("Fetch Orders Error:", error.message);
    res.status(500).send(error.message);
  }
};
