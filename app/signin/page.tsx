"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPage as SignInTemplate } from "@/components/ui/sign-in";
import { signIn } from "@/lib/dummy-auth";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({
        email: safeEmail,
        password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    const nextPath = redirectPath || "/products";
    router.push(nextPath);
  };

  const nextQuery = redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : "";

  return (
    <SignInTemplate
      title={<span className="font-light text-foreground tracking-tighter">Welcome Back</span>}
      description={
        error ? (
          <span className="text-destructive">{error}</span>
        ) : isSubmitting ? (
          "Signing you in..."
        ) : (
          "Sign in to view prices and place orders faster."
        )
      }
      heroImageSrc="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=2160&q=80"
      onSignIn={handleSubmit}
      onResetPassword={() => router.push("/contact")}
      onCreateAccount={() => router.push(`/signup${nextQuery}`)}
    />
  );
}
