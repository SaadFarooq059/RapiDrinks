"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuthUser } from "@/lib/dummy-auth";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    if (!safeName || !safeEmail) return;

    setAuthUser({
      name: safeName,
      email: safeEmail,
    });

    const nextPath = searchParams.get("next") || "/products";
    router.push(nextPath);
  };

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
        <Header />
        <section className="py-24">
          <div className="mx-auto max-w-md px-6">
            <h1 className="font-serif text-3xl font-bold text-foreground text-center">
              Sign Up
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Dummy signup for now. Real backend auth will be added later.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                Sign Up
              </Button>
            </form>

            <p className="mt-4 text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
