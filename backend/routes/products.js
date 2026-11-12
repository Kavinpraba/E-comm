import { Router } from 'express';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { search, category, sort, featured } = req.query;
  const query = {};
  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.name = { $regex: escapedSearch, $options: 'i' };
  }
  if (category && category !== 'All') query.category = category;
  if (featured === 'true') query.featured = true;

  const sortBy = sort === 'price-asc'
    ? { price: 1 }
    : sort === 'price-desc'
      ? { price: -1 }
      : { createdAt: -1 };
  const products = await Product.find(query).sort(sortBy);
  return res.json({ products });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product });
});

router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).json({ product });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ message: 'Product deleted.' });
});

export default router;
