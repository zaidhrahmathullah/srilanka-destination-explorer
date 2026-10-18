import Link from "next/link";

import { Container } from "@/components/layout/Container";

export default function DestinationNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center py-12">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Error 404
          </p>

          <h1 className="mt-3 text-3xl font-bold text-brand">
            Destination Not Found
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The destination you are looking for does not exist
            or may have been removed.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Back to Destinations
          </Link>
        </div>
      </Container>
    </main>
  );
}