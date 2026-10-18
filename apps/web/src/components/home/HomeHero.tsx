import Link from "next/link";

import { Container } from "@/components/layout/Container";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-900/40"
      />

      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#DDE8D5]">
            Discover the Pearl of the Indian Ocean
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Sri Lanka
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-emerald-50 sm:text-lg">
            From beautiful beaches to misty mountains and historic
            cities, discover unforgettable destinations across
            Sri Lanka.
          </p>

          <Link
            href="#destinations"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#A3B18A] px-6 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-[#C5D4B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explore Destinations
            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}