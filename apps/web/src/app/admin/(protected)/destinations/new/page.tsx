import Link from "next/link";
import { ArrowLeft, MapPinned } from "lucide-react";

import AdminDestinationForm from "@/components/admin/AdminDestinationForm";

export const metadata = {
  title: "Add Destination | Sri Lanka Destination Explorer",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddDestinationPage() {
  return (
    <main className="min-h-[75vh] bg-slate-50/60">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <MapPinned className="h-4 w-4" />
            Destination Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add Destination
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create a new destination for visitors to discover.
          </p>
        </div>

        <AdminDestinationForm mode="create" />
      </div>
    </main>
  );
}