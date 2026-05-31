"use client";

import { FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SignUpPage as SignUpTemplate } from "@/components/ui/sign-up";
import { setAuthUser } from "@/lib/dummy-auth";

type AccountType = "personal" | "business";

export default function SignUpPage() {
  const router = useRouter();

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>, accountType: AccountType) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const vatNumber = String(formData.get("vatNumber") || "").trim();
    const email = String(formData.get("email") || "");
    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail) return;

    const safeName = accountType === "business" ? businessName : fullName;
    if (!safeName) return;

    if (accountType === "business" && !vatNumber) return;

    setAuthUser({
      name: safeName,
      email: safeEmail,
    });

    const nextPath = redirectPath || "/products";
    router.push(nextPath);
  };

  const nextQuery = redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : "";

  return (
    <SignUpTemplate
      title={<span className="font-light text-foreground tracking-tighter">Join Rapid Drinks</span>}
      description="Pick your account type and start ordering in minutes."
      heroImageSrc="https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=2160&q=80"
      onSignUp={handleSubmit}
      onSignIn={() => router.push(`/signin${nextQuery}`)}
    />
  );
}
