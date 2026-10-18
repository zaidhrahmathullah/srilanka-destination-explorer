import { Container } from "@/components/layout/Container";

export default function Loading() {
  return (
    <main className="py-8 sm:py-10">
      <Container>
        <div
          role="status"
          aria-label="Loading destination"
          className="mx-auto max-w-3xl animate-pulse"
        >
          <div className="mb-5 h-5 w-40 rounded bg-slate-200" />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-48 bg-slate-200 sm:h-64" />

            <div className="space-y-5 p-5 sm:p-7">
              <div className="h-8 w-44 rounded bg-slate-200" />

              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="h-5 w-40 rounded bg-slate-200" />

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-20 rounded-lg bg-slate-100" />
                  <div className="h-20 rounded-lg bg-slate-100" />
                </div>
              </div>
            </div>
          </div>

          <span className="sr-only">Loading destination...</span>
        </div>
      </Container>
    </main>
  );
}