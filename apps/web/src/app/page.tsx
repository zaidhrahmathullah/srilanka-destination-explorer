
import { Container } from "@/components/layout/Container";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { getDestinations } from "@/lib/destinations";

import type { Destination } from "@/types/destination";

import { HomeHero } from "@/components/home/HomeHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let destinations: Destination[] = [];
  let hasError = false;

  try {
    destinations = await getDestinations();
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    hasError = true;
  }

  return (
    <main>
      <HomeHero />

      <section id="destinations" className="scroll-mt-8 py-12 sm:py-16">
        <Container>
          <h2 className="mb-8 text-2xl font-bold text-brand">
            Discover Destinations
          </h2>

          {hasError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800"
            >
              Unable to load destinations right now.
              Please try again later.
            </div>
          ) : destinations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-600">
                No destinations are available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}