import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

try {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 8 characters.');
  }
  await connectDB();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = ADMIN_NAME;
    existing.role = 'admin';
    existing.password = ADMIN_PASSWORD;
    await existing.save();
    console.log(`Administrator updated: ${email}`);
  } else {
    await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Administrator created: ${email}`);
  }
} catch (error) {
  console.error(`Could not create administrator: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
