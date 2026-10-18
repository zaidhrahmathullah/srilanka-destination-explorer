"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DestinationError({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("Destination page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center py-12">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-brand">
            Something Went Wrong
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            We could not load this destination right now.
            Please try again.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-brand transition hover:bg-slate-50"
            >
              Back to Destinations
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}