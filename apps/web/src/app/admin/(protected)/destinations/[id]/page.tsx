
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import AdminDestinationForm from "@/components/admin/AdminDestinationForm";
import { getDestinationById } from "@/lib/destinations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Destination | Sri Lanka Destination Explorer",
  robots: {
    index: false,
    follow: false,
  },
};

type EditDestinationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDestinationPage({
  params,
}: EditDestinationPageProps) {
  const { id } = await params;

  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

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
            <Pencil className="h-4 w-4" />
            Destination Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Destination
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Update the details of{" "}
            <span className="font-medium text-slate-700">
              {destination.name}
            </span>
            .
          </p>
        </div>

        <AdminDestinationForm
          mode="edit"
          destination={destination}
        />
      </div>
    </main>
  );
}