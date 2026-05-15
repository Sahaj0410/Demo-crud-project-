"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import { clearStoredAuth, getStoredAuth } from "@/lib/auth-storage";
import type { StoredAuth } from "@/lib/types";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const existing = getStoredAuth();
    if (!existing) {
      router.replace("/login");
      return;
    }
    setAuth(existing);
    setIsReady(true);
  }, [router]);

  const handleLogout = () => {
    clearStoredAuth();
    router.replace("/login");
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Checking your session...
      </div>
    );
  }

  if (!auth) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[color:var(--color-accent)]/15 blur-3xl" />
        <div className="absolute right-[-160px] top-12 h-96 w-96 rounded-full bg-[color:var(--color-accent-2)]/20 blur-3xl" />
      </div>
      <TopBar user={auth.user} onLogout={handleLogout} />
      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        {children}
      </main>
    </div>
  );
}
