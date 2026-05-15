"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, findUserByEmail, loginWithUsername } from "@/lib/api";
import { getStoredAuth, setStoredAuth } from "@/lib/auth-storage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = getStoredAuth();
    if (existing) {
      router.replace("/products");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const matchedUser = await findUserByEmail(email.trim());
      if (!matchedUser) {
        setError("We could not find a user with that email.");
        return;
      }

      const auth = await loginWithUsername(
        matchedUser.username,
        password.trim(),
      );

      setStoredAuth({
        token: auth.token,
        user: {
          id: auth.id,
          username: auth.username,
          email: auth.email,
          firstName: auth.firstName,
          lastName: auth.lastName,
          image: auth.image,
        },
      });

      router.replace("/products");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[color:var(--color-accent)]/15 blur-3xl" />
        <div className="absolute right-[-120px] top-1/3 h-80 w-80 rounded-full bg-[color:var(--color-accent-2)]/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-[#f7c9a9]/50 blur-3xl" />
      </div>
      <div className="relative w-full max-w-5xl rounded-[36px] p-6 glass-panel">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] bg-[color:var(--color-foreground)] px-8 py-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Secure access
            </p>
            <h1 className="display-font mt-4 text-4xl font-semibold leading-tight">
              Welcome back.
              <br />
              Login to explore products.
            </h1>
            <p className="mt-4 text-sm text-white/70">
              Pick any email from the DummyJSON users list and use the matching
              password for that account.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/70">
              <p className="rounded-2xl border border-white/15 px-4 py-3">
                Email example: emily.johnson@x.dummyjson.com
              </p>
              <p className="rounded-2xl border border-white/15 px-4 py-3">
                Password example: emilyjohnson
              </p>
            </div>
          </section>
          <section className="rounded-[28px] bg-white px-8 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Login
            </p>
            <h2 className="display-font mt-3 text-2xl font-semibold">
              Sign in to your dashboard
            </h2>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
                  placeholder="your@email.com"
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
                  placeholder="Your password"
                  required
                />
              </label>
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[color:var(--color-accent)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing you in..." : "Sign in"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
