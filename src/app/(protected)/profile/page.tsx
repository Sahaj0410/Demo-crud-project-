"use client";

import { useEffect, useState } from "react";
import { ApiError, getUserById } from "@/lib/api";
import { getStoredAuth } from "@/lib/auth-storage";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth) {
      return;
    }

    setIsLoading(true);
    setError(null);

    getUserById(auth.user.id, auth.token)
      .then((data) => setProfile(data))
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to load your profile.");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="text-sm text-muted">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-card rounded-[28px] p-8">
        <div className="flex items-center gap-6">
          <img
            src={profile.image ?? "https://dummyjson.com/image/200x200"}
            alt={`${profile.firstName} ${profile.lastName}`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-3xl object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              Your profile
            </p>
            <h1 className="display-font mt-3 text-3xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-muted">{profile.email}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Username
            </p>
            <p className="mt-2 text-sm font-medium">{profile.username}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Phone
            </p>
            <p className="mt-2 text-sm font-medium">{profile.phone ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Gender
            </p>
            <p className="mt-2 text-sm font-medium">
              {profile.gender ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Birth date
            </p>
            <p className="mt-2 text-sm font-medium">
              {profile.birthDate ?? "-"}
            </p>
          </div>
        </div>
      </section>
      <section className="surface-card rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Address
        </p>
        <h2 className="display-font mt-3 text-2xl font-semibold">
          Primary location
        </h2>
        <div className="mt-6 space-y-2 text-sm text-muted">
          <p>{profile.address?.address ?? "-"}</p>
          <p>
            {profile.address?.city ?? ""}
            {profile.address?.state ? `, ${profile.address.state}` : ""}
          </p>
          <p>{profile.address?.postalCode ?? ""}</p>
          <p>{profile.address?.country ?? ""}</p>
        </div>
        <div className="mt-8 rounded-2xl border border-black/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Company
          </p>
          <p className="mt-2 text-sm font-medium">
            {profile.company?.name ?? "-"}
          </p>
          <p className="text-sm text-muted">
            {profile.company?.title ?? ""}
          </p>
        </div>
      </section>
    </div>
  );
}
