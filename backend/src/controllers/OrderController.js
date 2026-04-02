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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Map to frontend expectation
      const mappedOrder = {
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
      };
      res.json(mappedOrder);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error("Fetch Order ID Error:", error.message);
    res.status(500).send(error.message);
  }
};
