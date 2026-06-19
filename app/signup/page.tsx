"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SignUpPage as SignUpTemplate,
  type BusinessSignupSuccess,
} from "@/components/ui/sign-up";
import { signUp } from "@/lib/dummy-auth";
import {
  isEmailExistsError,
  isVatRelatedError,
  normalizeVatNumber,
  validateBelgianVat,
} from "@/lib/vat";

type AccountType = "personal" | "business";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [vatError, setVatError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [businessSuccess, setBusinessSuccess] = useState<BusinessSignupSuccess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }, []);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    accountType: AccountType
  ) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setVatError(null);
    setEmailError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const businessName = String(formData.get("businessName") || "").trim();
    const vatNumber = normalizeVatNumber(String(formData.get("vatNumber") || ""));
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const safeEmail = email.trim().toLowerCase();

    if (!safeEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    const safeName = accountType === "business" ? businessName : fullName;
    if (!safeName) {
      setError(
        accountType === "business"
          ? "Please enter your business name."
          : "Please enter your full name."
      );
      return;
    }

    if (accountType === "business") {
      if (!vatNumber) {
        setVatError("Please enter your VAT number.");
        return;
      }
      const formatError = validateBelgianVat(vatNumber);
      if (formatError) {
        setVatError(formatError);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const user =
        accountType === "business"
          ? await signUp({
              accountType,
              businessName: safeName,
              vatNumber,
              email: safeEmail,
              password,
            })
          : await signUp({
              accountType,
              fullName: safeName,
              email: safeEmail,
              password,
            });

      if (accountType === "business" && user.vatVerified) {
        setBusinessSuccess({
          companyName: user.companyName || user.name,
          companyAddress: user.companyAddress,
        });
        return;
      }

      router.push(redirectPath || "/products");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create account.";

      if (isEmailExistsError(message)) {
        setEmailError(message);
      } else if (accountType === "business" && isVatRelatedError(message)) {
        setVatError(message);
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuery = redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : "";

  return (
    <SignUpTemplate
      title={<span className="font-light text-foreground tracking-tighter">Nearly Done !</span>}
      description={
        error ? (
          <span className="text-destructive">{error}</span>
        ) : isSubmitting ? (
          "Creating your account..."
        ) : (
          "Pick your account type and start ordering in minutes."
        )
      }
      heroImageSrc="https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=2160&q=80"
      onSignUp={handleSubmit}
      onSignIn={() => router.push(`/signin${nextQuery}`)}
      onContinue={() => router.push(redirectPath || "/products")}
      isSubmitting={isSubmitting}
      vatError={vatError}
      emailError={emailError}
      businessSuccess={businessSuccess}
    />
  );
}
