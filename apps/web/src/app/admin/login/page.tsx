import { ShieldCheck } from "lucide-react";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login | Sri Lanka Destination Explorer",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-sm">
            <ShieldCheck
              aria-hidden="true"
              className="h-7 w-7"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Sign In
          </h1>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <AdminLoginForm />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Sri Lanka Destination Explorer · Administration
        </p>
      </div>
    </main>
  );
}