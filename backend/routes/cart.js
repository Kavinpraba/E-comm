import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  return res.json({ items: cart?.items || [] });
});

router.put('/', async (req, res) => {
  if (!Array.isArray(req.body.items)) {
    return res.status(400).json({ message: 'Cart items must be an array.' });
  }
  const normalized = new Map();
  for (const item of req.body.items) {
    const quantity = Number(item.quantity);
    if (!item.product || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Each cart item needs a product and a positive quantity.' });
    }
    normalized.set(String(item.product), (normalized.get(String(item.product)) || 0) + quantity);
  }
  const ids = [...normalized.keys()];
  const products = await Product.find({ _id: { $in: ids } });
  if (products.length !== ids.length) {
    return res.status(400).json({ message: 'One or more cart products are no longer available.' });
  }
  for (const product of products) {
    if (normalized.get(product.id) > product.stock) {
      return res.status(400).json({ message: `${product.name} has only ${product.stock} in stock.` });
    }
  }
  const items = ids.map((product) => ({ product, quantity: normalized.get(product) }));
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { user: req.user.id, items },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('items.product');
  return res.json({ items: cart.items });
});

export default router;
