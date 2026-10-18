import "server-only";

import { getApiUrl } from "@/lib/api";
import type { CurrentWeather } from "@/types/weather";

export async function getDestinationWeather(
  destinationId: string
): Promise<CurrentWeather | null> {
  try {
    const response = await fetch(
      getApiUrl(
        `/destinations/${encodeURIComponent(destinationId)}/weather`
      ),
      {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      console.error(
        `Weather API returned HTTP ${response.status}`
      );

      return null;
    }

    const weather: CurrentWeather = await response.json();

    return weather;
  } catch (error) {
    console.error("Failed to load destination weather:", error);

    return null;
  }
}