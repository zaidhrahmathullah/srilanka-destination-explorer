"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Destination } from "@/types/destination";

type AdminDestinationListProps = {
  destinations: Destination[];
};

export default function AdminDestinationList({
  destinations,
}: AdminDestinationListProps) {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(destination: Destination) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${destination.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(destination._id);

    try {
      const response = await apiRequest(
        `/destinations/${encodeURIComponent(destination._id)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message || "Unable to delete destination.",
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete destination. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="destinations-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="destinations-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Destinations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {destinations.length}{" "}
            {destinations.length === 1
              ? "destination"
              : "destinations"}
          </p>
        </div>

        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          <Plus className="h-4 w-4" />
          Add Destination
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {destinations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <MapPin className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <h3 className="text-lg font-semibold text-slate-900">
            No destinations yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add your first destination to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {destinations.map((destination) => (
            <article
              key={destination._id}
              className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative w-28 shrink-0 bg-emerald-50 sm:w-48 md:w-56">
                <Image
                  src={
                    destination.imageUrl ||
                    "/destination-placeholder.png"
                  }
                  alt={destination.imageUrl ? destination.name : ""}
                  fill
                  unoptimized={Boolean(destination.imageUrl)}
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 192px, 224px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {destination.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    {destination.description}
                  </p>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-all">
                      {destination.latitude},{" "}
                      {destination.longitude}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/destinations/${destination._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-emerald-800 sm:text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>

                  <Link
                    href={`/admin/destinations/${destination._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 transition hover:text-emerald-950 sm:text-sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(destination)}
                    disabled={deletingId !== null}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {deletingId === destination._id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}

                    {deletingId === destination._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}