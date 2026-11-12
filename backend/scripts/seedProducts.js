import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';

const products = [
  {
    name: 'Sunday Ceramic Vase',
    description: 'A quietly sculptural stoneware vase with a softly textured glaze. Lovely with a few branches, and just as lovely on its own.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85',
    price: 42,
    rating: 4.9,
    stock: 18,
    featured: true,
  },
  {
    name: 'Soft Morning Throw',
    description: 'A generous, wonderfully soft woven throw for slow mornings, cool evenings, and every comfortable moment in between.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    price: 68,
    rating: 4.8,
    stock: 12,
    featured: true,
  },
  {
    name: 'Everyday Leather Tote',
    description: 'An easy, unfussy carryall made for everyday errands and weekend wanderings. Room for the things you need, without the extra fuss.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    price: 54,
    rating: 4.7,
    stock: 9,
    featured: true,
  },
  {
    name: 'Quiet Hour Candle',
    description: 'A clean-burning soy candle with warm cedar, soft citrus, and a little space to breathe. Poured in a reusable glass vessel.',
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85',
    price: 28,
    rating: 4.9,
    stock: 24,
    featured: true,
  },
  {
    name: 'Little Notes Journal',
    description: 'A lay-flat, clothbound journal with smooth, lightly textured pages for lists, ideas, doodles, and the thoughts worth keeping.',
    category: 'Stationery',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85',
    price: 19,
    rating: 4.6,
    stock: 30,
    featured: false,
  },
  {
    name: 'Sunday Stoneware Mug',
    description: 'A satisfyingly weighty handmade-feel mug with a comfortable handle and a warm, speckled finish. Holds 12 ounces of your favorite.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
    price: 24,
    rating: 4.8,
    stock: 20,
    featured: false,
  },
  {
    name: 'Small Ritual Hand Balm',
    description: 'A pocket-sized, nourishing hand balm with a light botanical scent. An everyday little pause for hands that do a lot.',
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
    price: 16,
    rating: 4.7,
    stock: 35,
    featured: false,
  },
  {
    name: 'Weekender Pouch',
    description: 'A simple, sturdy zip pouch to keep the small essentials close at home or tucked into your bag for a change of scene.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    price: 32,
    rating: 4.6,
    stock: 14,
    featured: false,
  },
];

try {
  await connectDB();
  if (await Product.exists({})) {
    console.log('Products already exist; the starter collection was not added.');
  } else {
    await Product.insertMany(products);
    console.log(`Added ${products.length} starter products.`);
  }
} catch (error) {
  console.error(`Could not seed products: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
