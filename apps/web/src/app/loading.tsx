import { Container } from "@/components/layout/Container";

export default function Loading() {
  return (
    <main className="py-16">
      <Container>
        <div
          role="status"
          aria-label="Loading destinations"
          className="space-y-8 animate-pulse"
        >
          <div className="mx-auto h-10 w-64 rounded-lg bg-slate-200" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/10] bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-6 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>

          <span className="sr-only">Loading destinations...</span>
        </div>
      </Container>
    </main>
  );
}