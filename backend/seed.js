import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  stock: Number,
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

const products = [
  // NIKE
  { name: "Nike Dri-FIT T-Shirt", brand: "Nike", price: 1999, description: "Sweat-wicking T-shirt for workouts", image: "/images/nike1.jpg", category: "activewear", stock: 50 },
  { name: "Nike Sports Hoodie", brand: "Nike", price: 3499, description: "Warm hoodie for training and casual wear", image: "/images/nike2.jpg", category: "kids", stock: 40 },
  { name: "Nike Training Shorts", brand: "Nike", price: 1499, description: "Lightweight breathable shorts", image: "/images/nike3.jpg", category: "activewear", stock: 60 },
  { name: "Nike Track Jacket", brand: "Nike", price: 3999, description: "Stylish jacket for sports and casual use", image: "/images/nike4.jpg", category: "activewear", stock: 30 },
  { name: "Nike Air Zoom Shoes", brand: "Nike", price: 7999, description: "High-performance running shoes", image: "/images/nike5.jpg", category: "footwear", stock: 25 },
  { name: "Nike Cap", brand: "Nike", price: 999, description: "Classic adjustable sports cap", image: "/images/nike6.jpg", category: "accessories", stock: 70 },
  // PUMA
  { name: "Puma Essentials T-Shirt", brand: "Puma", price: 1299, description: "Comfortable everyday T-shirt", image: "/images/puma1.jpg", category: "menswear", stock: 55 },
  { name: "Puma Training Hoodie", brand: "Puma", price: 2999, description: "Perfect hoodie for workouts", image: "/images/puma2.jpg", category: "activewear", stock: 45 },
  { name: "Puma Sweatpants", brand: "Puma", price: 2499, description: "Relaxed fit sweatpants", image: "/images/puma3.jpg", category: "activewear", stock: 50 },
  { name: "Puma Windbreaker Jacket", brand: "Puma", price: 3599, description: "Lightweight windproof jacket", image: "/images/puma4.jpg", category: "activewear", stock: 35 },
  { name: "Puma Running Shoes", brand: "Puma", price: 4999, description: "Durable and stylish running shoes", image: "/images/puma5.jpg", category: "footwear", stock: 20 },
  { name: "Puma Backpack", brand: "Puma", price: 1999, description: "Spacious everyday backpack", image: "/images/puma6.jpg", category: "accessories", stock: 40 },
  // H&M
  { name: "H&M Cotton T-Shirt", brand: "H&M", price: 799, description: "Soft cotton everyday wear", image: "/images/hm1.jpg", category: "summer-collect", stock: 80 },
  { name: "H&M Casual Shirt", brand: "H&M", price: 1499, description: "Slim fit casual shirt", image: "/images/hm2.jpg", category: "summer-collect", stock: 60 },
  { name: "H&M Sweatshirt", brand: "H&M", price: 1799, description: "Comfortable stylish sweatshirt", image: "/images/hm3.jpg", category: "menswear", stock: 50 },
  { name: "H&M Denim Jacket", brand: "H&M", price: 2999, description: "Classic denim jacket", image: "/images/hm4.jpg", category: "menswear", stock: 30 },
  { name: "H&M Sneakers", brand: "H&M", price: 2499, description: "Minimal casual sneakers", image: "/images/hm5.jpg", category: "footwear", stock: 25 },
  { name: "H&M Sunglasses", brand: "H&M", price: 699, description: "Trendy UV protection sunglasses", image: "/images/hm6.jpg", category: "accessories", stock: 90 },
  // ZARA
  { name: "Zara Premium T-Shirt", brand: "Zara", price: 1599, description: "Premium cotton fashion T-shirt", image: "/images/zara1.jpg", category: "menswear", stock: 70 },
  { name: "Zara Formal Shirt", brand: "Zara", price: 2499, description: "Elegant formal wear shirt", image: "/images/zara2.jpg", category: "formal-attire", stock: 50 },
  { name: "Zara Slim Fit Blazer", brand: "Zara", price: 4999, description: "Modern tailored blazer", image: "/images/zara3.jpg", category: "formal-attire", stock: 20 },
  { name: "Zara Wool Coat", brand: "Zara", price: 6999, description: "Stylish winter coat", image: "/images/zara4.jpg", category: "winter-wear", stock: 15 },
  { name: "Zara Leather Shoes", brand: "Zara", price: 3999, description: "Premium formal shoes", image: "/images/zara5.jpg", category: "footwear", stock: 18 },
  { name: "Zara Leather Belt", brand: "Zara", price: 1299, description: "Classic leather belt", image: "/images/zara6.jpg", category: "accessories", stock: 40 },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB Connected');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

run();
