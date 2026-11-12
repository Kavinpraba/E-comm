import { Router } from 'express';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name?.trim() || !address?.trim() || !phone?.trim()) {
    return res.status(400).json({ message: 'Name, delivery address, and phone number are required.' });
  }
  if (!/^[+\d\s().-]{7,20}$/.test(phone.trim())) {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart?.items.length) return res.status(400).json({ message: 'Your cart is empty.' });

  const items = [];
  let total = 0;
  for (const item of cart.items) {
    const product = item.product;
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        message: `${product?.name || 'A product'} is no longer available in the requested quantity.`,
      });
    }
    items.push({
      product: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    });
    total += product.price * item.quantity;
  }

  const shippingCost = total >= 75 ? 0 : 7.5;
  const reserved = [];
  const restoreStock = () => Promise.all(reserved.map(({ product, quantity }) =>
    Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
  ));
  let unavailableItem;
  try {
    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        unavailableItem = item;
        break;
      }
      reserved.push({ product: item.product.id, quantity: item.quantity });
    }
  } catch (error) {
    await restoreStock();
    throw error;
  }
  if (unavailableItem) {
    await restoreStock();
    return res.status(409).json({ message: `${unavailableItem.product.name} just sold out. Please refresh your cart.` });
  }

  let order;
  try {
    order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress: { name: name.trim(), address: address.trim(), phone: phone.trim() },
      shippingCost,
      total: Number((total + shippingCost).toFixed(2)),
      paymentMethod: 'cash_on_delivery',
    });
  } catch (error) {
    await restoreStock();
    throw error;
  }
  await Cart.findByIdAndUpdate(cart.id, { items: [] });
  return res.status(201).json({ order });
});

router.get('/mine', async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ orders });
});

router.get('/', adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  return res.json({ orders });
});

export default router;
