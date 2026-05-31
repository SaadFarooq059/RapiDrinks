"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type AccountType = "personal" | "business";

interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>, accountType: AccountType) => void;
  onSignIn?: () => void;
}

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Create Account</span>,
  description = "Choose your profile and join Rapid Drinks",
  heroImageSrc,
  onSignUp,
  onSignIn,
}) => {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans w-full bg-background text-foreground">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>

            <div className="animate-element animate-delay-300 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("personal")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  accountType === "personal"
                    ? "border-violet-400/70 bg-violet-500/10"
                    : "border-border bg-card hover:bg-secondary/60"
                }`}
              >
                <p className="font-semibold">Personal</p>
                <p className="text-sm text-muted-foreground mt-1">For individual buyers.</p>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("business")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  accountType === "business"
                    ? "border-violet-400/70 bg-violet-500/10"
                    : "border-border bg-card hover:bg-secondary/60"
                }`}
              >
                <p className="font-semibold">Business</p>
                <p className="text-sm text-muted-foreground mt-1">VAT required for B2B orders.</p>
              </button>
            </div>

            {accountType && (
              <form className="space-y-5" onSubmit={(event) => onSignUp?.(event, accountType)}>
                {accountType === "personal" ? (
                  <div className="animate-element animate-delay-400">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <GlassInputWrapper>
                      <input
                        name="fullName"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                      />
                    </GlassInputWrapper>
                  </div>
                ) : (
                  <>
                    <div className="animate-element animate-delay-400">
                      <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                      <GlassInputWrapper>
                        <input
                          name="businessName"
                          type="text"
                          required
                          placeholder="Enter your business name"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>
                    <div className="animate-element animate-delay-500">
                      <label className="text-sm font-medium text-muted-foreground">VAT Number</label>
                      <GlassInputWrapper>
                        <input
                          name="vatNumber"
                          type="text"
                          required
                          placeholder="Enter your VAT number"
                          className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                        />
                      </GlassInputWrapper>
                    </div>
                  </>
                )}

                <div className="animate-element animate-delay-600">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    />
                  </GlassInputWrapper>
                </div>

                <div className="animate-element animate-delay-700">
                  <label className="text-sm font-medium text-muted-foreground">Password</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Create a password"
                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>

                <button
                  type="submit"
                  className="animate-element animate-delay-800 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {accountType === "business" ? "Create Business Account" : "Create Personal Account"}
                </button>
              </form>
            )}

            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSignIn}
                className="text-violet-400 hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          ></div>
        </section>
      )}
    </div>
  );
};
