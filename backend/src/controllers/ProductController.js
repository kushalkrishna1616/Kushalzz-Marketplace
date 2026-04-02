import Product from '../models/Product.js';

// Get all products (Public with optional filtering)
export const getProducts = async (req, res) => {
  try {
    const { category, brand } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Price (Admin only - requires secret key)
export const updatePrice = async (req, res) => {
  const { id } = req.params;
  const { price, adminKey } = req.body;

  if (adminKey !== 'premium_kushalzz_key_2026') {
    return res.status(401).json({ message: '⛔ Unauthorized! Admin key invalid.' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: '❌ Product not found.' });

    product.price = price;
    const updatedProduct = await product.save();
    res.json({ message: '✅ Price updated successfully!', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add New Brand (Admin only)
export const addProduct = async (req, res) => {
  const { name, brand, price, category, stock, isPremium, adminKey } = req.body;

  if (adminKey !== 'premium_kushalzz_key_2026') {
    return res.status(401).json({ message: '⛔ Unauthorized! Admin key invalid.' });
  }

  try {
    const product = await Product.create({ name, brand, price, category, stock, isPremium });
    res.status(201).json({ message: '✅ Brand product added successfully!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Search products by name, brand, or category
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
