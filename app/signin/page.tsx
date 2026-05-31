"use client";

import { FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SignInPage as SignInTemplate } from "@/components/ui/sign-in";
import { setAuthUser } from "@/lib/dummy-auth";

export default function SignInPage() {
  const router = useRouter();

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail) return;

    setAuthUser({
      name: safeEmail.split("@")[0] || "User",
      email: safeEmail,
    });

    const nextPath = redirectPath || "/products";
    router.push(nextPath);
  };

  const nextQuery = redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : "";

  return (
    <SignInTemplate
      title={<span className="font-light text-foreground tracking-tighter">Welcome Back</span>}
      description="Sign in to view prices and place orders faster."
      heroImageSrc="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=2160&q=80"
      onSignIn={handleSubmit}
      onResetPassword={() => router.push("/contact")}
      onCreateAccount={() => router.push(`/signup${nextQuery}`)}
    />
  );
}
