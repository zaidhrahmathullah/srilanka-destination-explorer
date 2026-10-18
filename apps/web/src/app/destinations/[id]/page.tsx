import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { getDestinationById } from "@/lib/destinations";

import { getDestinationWeather } from "@/lib/weather";
import { WeatherCard } from "@/components/weather/WeatherCard";

type DestinationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { id } = await params;

  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  const weather = await getDestinationWeather(id);

  const { name, description, latitude, longitude, imageUrl } = destination;

  return (
    <main className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition hover:underline"
          >
            <span aria-hidden="true">←</span>
            Back to Destinations
          </Link>

          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="h-48 overflow-hidden bg-emerald-50 sm:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl || "/destination-placeholder.png"}
                alt={
                  imageUrl ? `View of ${name}` : "Destination image unavailable"
                }
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7">
              <h1 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
                {name}
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                {description}
              </p>

              <div className="my-6 border-t border-slate-200" />

              <section>
                <h2 className="text-base font-semibold text-brand">
                  Location Information
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Latitude</p>

                    <p className="mt-1 text-sm font-semibold text-brand">
                      {latitude.toFixed(4)}°
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Longitude</p>

                    <p className="mt-1 text-sm font-semibold text-brand">
                      {longitude.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </section>

              <div className="my-6 border-t border-slate-200" />

              
              <WeatherCard weather={weather} />

            </div>
          </article>
        </div>
      </Container>
    </main>
  );
}