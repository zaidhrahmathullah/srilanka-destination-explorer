import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminDestinationList from "@/components/admin/AdminDestinationList";
import { getDestinations } from "@/lib/destinations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Sri Lanka Destination Explorer",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const destinations = await getDestinations();

  return (
    <main className="min-h-[75vh] bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium text-emerald-800">
              Administration
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage destinations across Sri Lanka.
            </p>
          </div>

          <AdminLogoutButton />
        </div>

        <AdminDestinationList destinations={destinations} />
      </div>
    </main>
  );
}