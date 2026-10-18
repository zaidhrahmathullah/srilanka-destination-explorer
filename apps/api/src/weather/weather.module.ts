import { Module } from '@nestjs/common';

import { DestinationsModule } from '../destinations/destinations.module.js';
import { WeatherController } from './weather.controller.js';
import { WeatherService } from './weather.service.js';

@Module({
  imports: [DestinationsModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}