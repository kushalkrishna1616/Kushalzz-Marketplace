import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard metrics
export const getAdminMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Sum total price of all paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => {
       const amount = Number(order.totalPrice) || 0;
       return acc + amount;
    }, 0);

    const salesTrends = [
      { name: "Mon", sales: 4000 },
      { name: "Tue", sales: 3000 },
      { name: "Wed", sales: 2000 },
      { name: "Thu", sales: 2780 },
      { name: "Fri", sales: 1890 },
      { name: "Sat", sales: 2390 },
      { name: "Sun", sales: totalRevenue }, 
    ];

    res.json({
      totalSales: totalOrders,
      totalCustomers: totalUsers,
      totalProducts,
      totalRevenue,
      salesTrends
    });
  } catch (error) {
    console.error("METRICS ERROR:", error.message);
    res.status(500).json({ msg: "Failed to calculate boutique metrics" });
  }
};

// @desc    Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // Populate user if exists, but don't fail if guest
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    
    const mappedOrders = orders.map(order => ({
        _id: order._id,
        user: order.user ? { name: order.user.name, email: order.user.email } : { name: "Boutique Guest", email: "N/A" },
        createdAt: order.createdAt,
        status: order.isPaid && !order.isDelivered ? 'PAID' : order.isDelivered ? 'DELIVERED' : 'PLACED',
        total: Number(order.totalPrice) || 0
    }));

    res.json(mappedOrders);
  } catch (error) {
    console.error("ADMIN ORDERS FETCH ERROR:", error.message);
    res.status(500).json({ msg: "Failed to retrieve global orders" });
  }
};

// @desc    Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status } = req.body;
      if (status === 'DELIVERED') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
      }
      await order.save();
      res.json({ msg: 'Order status updated' });
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error.message);
    res.status(500).json({ msg: error.message });
  }
};
