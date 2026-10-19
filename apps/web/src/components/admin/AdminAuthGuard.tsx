"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { apiRequest } from "@/lib/api";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await apiRequest("/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!active) return;

        if (response.ok) {
          setAuthenticated(true);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        if (active) {
          router.replace("/admin/login");
        }
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          className="h-6 w-6 animate-spin text-emerald-800"
          aria-label="Checking administrator session"
        />
      </div>
    );
  }

  return <>{children}</>;
}