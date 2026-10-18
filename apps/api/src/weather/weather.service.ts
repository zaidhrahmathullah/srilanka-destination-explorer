import {
  BadGatewayException,
  Injectable,
  Logger,
} from '@nestjs/common';
import type {
  CurrentWeather,
  OpenMeteoResponse,
} from './weather.types.js';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  private getWeatherCondition(code: number): string {
    const conditions: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        97: "Heavy thunderstorm",
        99: "Thunderstorm with heavy hail"
    };

    return conditions[code] ?? 'Unknown weather condition';
  }

  async getCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<CurrentWeather> {
    const url = new URL('https://api.open-meteo.com/v1/forecast');

    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    );
    url.searchParams.set('timezone', 'Asia/Colombo');

    try {
      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(
          `Open-Meteo returned HTTP ${response.status}`,
        );
      }

      const data: unknown = await response.json();

      if (!this.isValidWeatherResponse(data)) {
        throw new Error('Invalid Open-Meteo response');
      }

      return {
        temperature: data.current.temperature_2m,
        condition: this.getWeatherCondition(
          data.current.weather_code,
        ),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        observedAt: data.current.time,
        timezone: data.timezone,
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve weather from Open-Meteo',
        error instanceof Error ? error.stack : String(error),
      );

      throw new BadGatewayException(
        'Weather information is temporarily unavailable',
      );
    }
  }

  private isValidWeatherResponse(
    data: unknown,
  ): data is OpenMeteoResponse {
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const result = data as Partial<OpenMeteoResponse>;
    const current = result.current;

    return (
      typeof result.timezone === 'string' &&
      typeof current === 'object' &&
      current !== null &&
      typeof current.time === 'string' &&
      typeof current.temperature_2m === 'number' &&
      Number.isFinite(current.temperature_2m) &&
      typeof current.relative_humidity_2m === 'number' &&
      Number.isFinite(current.relative_humidity_2m) &&
      typeof current.weather_code === 'number' &&
      Number.isInteger(current.weather_code) &&
      typeof current.wind_speed_10m === 'number' &&
      Number.isFinite(current.wind_speed_10m)
    );
  }
}