import express from 'express';
import { getProducts, updatePrice, addProduct, getProductById, searchProducts } from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.put('/:id', updatePrice);
router.post('/', addProduct);

export default router;
