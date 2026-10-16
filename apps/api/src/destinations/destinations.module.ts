import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Destination,
  DestinationSchema,
} from './schemas/destination.schema.js';

import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Destination.name,
        schema: DestinationSchema,
      },
    ]),
  ],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}