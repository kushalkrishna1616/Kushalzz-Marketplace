import Wishlist from '../models/Wishlist.js';

// GET /api/wishlist — get all products in user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id }).populate('product');
    // Extract product objects (only return the product data)
    const products = wishlistItems.map((item) => item.product).filter(p => p !== null);
    res.json(products);
  } catch (err) {
    console.error("Fetch wishlist error:", err);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

// POST /api/wishlist/toggle — add or remove a product from wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    const existing = await Wishlist.findOne({ user: req.user._id, product: productId });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      res.json({ added: false, message: 'Removed from wishlist' });
    } else {
      await Wishlist.create({ user: req.user._id, product: productId });
      res.json({ added: true, message: 'Added to wishlist' });
    }
  } catch (err) {
    console.error("Toggle wishlist error:", err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
};
