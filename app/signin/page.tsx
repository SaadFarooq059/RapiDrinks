"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuthUser } from "@/lib/dummy-auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail) return;

    setAuthUser({
      name: safeEmail.split("@")[0] || "User",
      email: safeEmail,
    });

    const nextPath = redirectPath || "/products";
    router.push(nextPath);
  };

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
        <Header />
        <section className="py-24">
          <div className="mx-auto max-w-md px-6">
            <h1 className="font-serif text-3xl font-bold text-foreground text-center">
              Sign In
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Dummy login for now. We will connect real backend later.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
