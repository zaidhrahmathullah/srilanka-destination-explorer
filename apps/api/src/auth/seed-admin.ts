import 'dotenv/config';

import mongoose from 'mongoose';

import { AdminSchema } from './schemas/admin.schema.js';
import { hashPassword } from './password.util.js';

async function seedAdmin(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!mongoUri || !email || !password) {
    throw new Error(
      'MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be configured.',
    );
  }

  await mongoose.connect(mongoUri);

  try {
    const AdminModel = mongoose.model('Admin', AdminSchema);

    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      console.log('Administrator already exists. Skipping creation.');
      return;
    }

    const existingAdminCount = await AdminModel.countDocuments();

    if (existingAdminCount > 0) {
      throw new Error(
        'An administrator already exists with a different email.',
      );
    }

    const passwordHash = await hashPassword(password);

    await AdminModel.create({
      email,
      passwordHash,
    });

    console.log('Predefined administrator created successfully.');
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error('Admin seeding failed:', error);
  process.exitCode = 1;
});