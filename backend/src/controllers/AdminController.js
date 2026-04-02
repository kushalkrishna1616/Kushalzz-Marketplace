import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getAdminMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    // Simple sales trends (last 7 days - placeholder logic)
    const salesTrends = [
      { name: "Mon", sales: 4000 },
      { name: "Tue", sales: 3000 },
      { name: "Wed", sales: 2000 },
      { name: "Thu", sales: 2780 },
      { name: "Fri", sales: 1890 },
      { name: "Sat", sales: 2390 },
      { name: "Sun", sales: totalRevenue }, // Real Sunday sale!
    ];

    res.json({
      totalSales: totalOrders,
      totalCustomers: totalUsers,
      totalProducts,
      totalRevenue,
      salesTrends
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    
    // Map to frontend expectation
    const mappedOrders = orders.map(order => ({
        _id: order._id,
        user: order.user,
        createdAt: order.createdAt,
        status: order.isPaid && !order.isDelivered ? 'PAID' : order.isDelivered ? 'DELIVERED' : 'PLACED',
        total: order.totalPrice
    }));

    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status } = req.body;
      if (status === 'DELIVERED') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
      }
      // You can add more status logic here
      await order.save();
      res.json({ msg: 'Order status updated' });
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
