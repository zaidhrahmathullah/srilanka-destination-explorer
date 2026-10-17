
import 'dotenv/config';

import mongoose from 'mongoose';

import { AdminSchema } from '../auth/schemas/admin.schema.js';
import { hashPassword } from '../auth/password.util.js';
import { DestinationSchema } from '../destinations/schemas/destination.schema.js';
import { initialDestinations } from './destinations.data.js';

async function seedDatabase(): Promise<void> {
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
    const DestinationModel = mongoose.model(
      'Destination',
      DestinationSchema,
    );

    // 1. Seed the predefined administrator.
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      console.log('Administrator already exists. Skipping creation.');
    } else {
      const adminCount = await AdminModel.countDocuments();

      if (adminCount > 0) {
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
    }

    // 2. Seed the three sample destinations.
    for (const destination of initialDestinations) {
      const existingDestination = await DestinationModel.findOne({
        name: {
          $regex: `^${destination.name}$`,
          $options: 'i',
        },
      });

      if (existingDestination) {
        console.log(
          `${destination.name} already exists. Skipping creation.`,
        );
        continue;
      }

      await DestinationModel.create(destination);

      console.log(`${destination.name} created successfully.`);
    }

    console.log('Database seeding completed.');
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Database seeding failed:', error);
  process.exitCode = 1;
});