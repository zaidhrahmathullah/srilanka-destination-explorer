
import "server-only";

import { getApiUrl } from "@/lib/api";
import type { Destination } from "@/types/destination";

export async function getDestinations(): Promise<Destination[]> {
  const response = await fetch(getApiUrl("/destinations"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load destinations");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid destinations response");
  }

  return data as Destination[];
}


export async function getDestinationById(
  id: string,
): Promise<Destination | null> {
  const response = await fetch(
    getApiUrl(`/destinations/${encodeURIComponent(id)}`),
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load destination");
  }

  const destination: Destination = await response.json();

  return destination;
}