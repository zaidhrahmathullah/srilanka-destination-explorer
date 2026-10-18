import { Controller, Get, Param } from '@nestjs/common';

import { DestinationsService } from '../destinations/destinations.service.js';
import { WeatherService } from './weather.service.js';

@Controller('destinations')
export class WeatherController {
  constructor(
    private readonly destinationsService: DestinationsService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get(':id/weather')
  async getDestinationWeather(@Param('id') id: string) {
    const destination = await this.destinationsService.findOne(id);

    return this.weatherService.getCurrentWeather(
      destination.latitude,
      destination.longitude,
    );
  }
}