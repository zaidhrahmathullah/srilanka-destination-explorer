import type { CurrentWeather } from "@/types/weather";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Wind,
  Droplets,
} from "lucide-react";

type WeatherCardProps = {
  weather: CurrentWeather | null;
};

function formatWeatherTime(time: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(
    time
  );

  if (!match) {
    return "Time unavailable";
  }

  const hours = Number(match[4]);
  const minutes = match[5];
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
}


function getWeatherIcon(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("thunder")) {
    return <CloudLightning />;
  }

  if (value.includes("snow")) {
    return <CloudSnow />;
  }

  if (value.includes("drizzle")) {
    return <CloudDrizzle />;
  }

  if (value.includes("rain")) {
    return <CloudRain />;
  }

  if (value.includes("fog")) {
    return <CloudFog />;
  }

  if (value.includes("partly") || value.includes("mainly clear")) {
    return <CloudSun />;
  }

  if (value.includes("cloud") || value.includes("overcast")) {
    return <Cloud />;
  }

  return <Sun />;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  if (!weather) {
    return (
      <section aria-labelledby="weather-heading">
        <h2
          id="weather-heading"
          className="text-base font-semibold text-brand"
        >
          Current Weather
        </h2>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            Weather information is temporarily unavailable.
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const weatherIcon = getWeatherIcon(weather.condition);

  return (
    <section aria-labelledby="weather-heading">
      <h2
        id="weather-heading"
        className="text-base font-semibold text-brand"
      >
        Current Weather
      </h2>

      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-600">
              {weather.condition}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-brand">
              {weather.temperature}°C
            </p>
          </div>

          <div
            aria-hidden="true"
            className="text-brand-accent [&>svg]:h-11 [&>svg]:w-11 [&>svg]:stroke-[1.5]"
          >
            {weatherIcon}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-emerald-100 pt-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
                <Droplets aria-hidden="true" className="h-4 w-4" />
                <p className="text-xs">Humidity</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-brand">
              {weather.humidity}%
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-500">
                <Wind aria-hidden="true" className="h-4 w-4" />
                <p className="text-xs">Wind Speed</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-brand">
              {weather.windSpeed} km/h
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Weather data time: {formatWeatherTime(weather.observedAt)}
          {" · "}
          Sri Lanka time
        </p>
      </div>
    </section>
  );
}