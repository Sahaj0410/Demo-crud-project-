"use client";

import Image from "next/image";
import Link from "next/link";
import type { AuthUser } from "@/lib/types";

type TopBarProps = {
  user: AuthUser;
  onLogout: () => void;
};

function getInitials(user: AuthUser) {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  const initials = `${first}${last}`.trim();

  if (initials.length > 0) {
    return initials.toUpperCase();
  }

  return user.username.slice(0, 2).toUpperCase();
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[color:var(--color-card)]/85 backdrop-blur shadow-[0_12px_30px_rgba(28,23,19,0.08)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-accent-2)] text-sm font-semibold text-white">
            TP
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">
              Demo Project
            </p>
            <p className="text-lg font-semibold">Product Dashboard</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link className="hover:text-[color:var(--color-accent)]" href="/products">
            Products
          </Link>
          <Link className="hover:text-[color:var(--color-accent)]" href="/profile">
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-sm md:block">
            <p className="font-medium">{user.firstName}</p>
            <p className="text-muted">{user.email}</p>
          </div>
          {user.image ? (
            <Image
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white text-xs font-semibold">
              {getInitials(user)}
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
