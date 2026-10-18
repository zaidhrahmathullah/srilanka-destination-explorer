import Link from "next/link";

import type { Destination } from "@/types/destination";

type DestinationCardProps = {
  destination: Destination;
};

export function DestinationCard({
  destination,
}: DestinationCardProps) {
  const { _id, name, description, imageUrl } = destination;

  return (
    <Link
      href={`/destinations/${_id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "/destination-placeholder.png"}
          alt={
            imageUrl
              ? `View of ${name}`
              : "Destination image unavailable"
          }
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-4">
        <h2 className="text-lg font-semibold text-brand">
          {name}
        </h2>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">
          Explore destination

          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}