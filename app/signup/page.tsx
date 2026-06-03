"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpPage as SignUpTemplate } from "@/components/ui/sign-up";
import { signUp } from "@/lib/dummy-auth";

type AccountType = "personal" | "business";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    accountType: AccountType
  ) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const vatNumber = String(formData.get("vatNumber") || "").trim();
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail || !password.trim()) return;

    const safeName = accountType === "business" ? businessName : fullName;
    if (!safeName) return;

    if (accountType === "business" && !vatNumber) return;

    try {
      if (accountType === "business") {
        await signUp({
          accountType,
          businessName: safeName,
          vatNumber,
          email: safeEmail,
          password,
        });
      } else {
        await signUp({
          accountType,
          fullName: safeName,
          email: safeEmail,
          password,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
      return;
    }

    const nextPath = redirectPath || "/products";
    router.push(nextPath);
  };

  const nextQuery = redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : "";

  return (
    <SignUpTemplate
      title={<span className="font-light text-foreground tracking-tighter">Join Rapid Drinks</span>}
      description={
        error ? <span className="text-destructive">{error}</span> : "Pick your account type and start ordering in minutes."
      }
      heroImageSrc="https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=2160&q=80"
      onSignUp={handleSubmit}
      onSignIn={() => router.push(`/signin${nextQuery}`)}
    />
  );
}
