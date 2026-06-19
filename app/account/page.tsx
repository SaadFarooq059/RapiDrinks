"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Pencil, User, X } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AUTH_UPDATED_EVENT,
  getAuthUser,
  getCurrentUser,
  isAuthenticated,
  updateProfile,
  verifyVat,
  type DummyAuthUser,
} from "@/lib/dummy-auth";
import {
  getVatDigitCount,
  isVatRelatedError,
  normalizeVatNumber,
  validateBelgianVat,
} from "@/lib/vat";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<DummyAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editVatNumber, setEditVatNumber] = useState("");
  const [vatError, setVatError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!isAuthenticated()) {
        router.replace("/signin?next=/account");
        return;
      }

      try {
        const profile = await getCurrentUser();
        if (!isMounted) return;
        setUser(profile);
      } catch {
        if (!isMounted) return;
        setUser(getAuthUser());
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const syncFromStorage = () => {
      setUser(getAuthUser());
    };

    void loadProfile();
    window.addEventListener(AUTH_UPDATED_EVENT, syncFromStorage);
    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_UPDATED_EVENT, syncFromStorage);
    };
  }, [router]);

  const startEditing = () => {
    if (!user) return;
    setEditName(user.name);
    setEditVatNumber(user.vatNumber || "");
    setVatError(null);
    setProfileError(null);
    setProfileSuccess(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setVatError(null);
    setProfileError(null);
  };

  const handleVatChange = (value: string) => {
    const upper = value.toUpperCase();
    if (upper.startsWith("BE")) {
      setEditVatNumber(`BE${upper.slice(2).replace(/\D/g, "").slice(0, 10)}`);
      return;
    }
    const digits = upper.replace(/\D/g, "").slice(0, 10);
    setEditVatNumber(digits ? `BE${digits}` : "");
  };

  const handleSaveProfile = async () => {
    if (!user || isSaving) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setProfileError("Please enter your name.");
      return;
    }

    let normalizedVat: string | undefined;
    if (user.accountType === "business") {
      normalizedVat = normalizeVatNumber(editVatNumber);
      if (!normalizedVat) {
        setVatError("Please enter your VAT number.");
        return;
      }
      const formatError = validateBelgianVat(normalizedVat);
      if (formatError) {
        setVatError(formatError);
        return;
      }
    }

    setProfileError(null);
    setVatError(null);
    setProfileSuccess(null);
    setIsSaving(true);

    try {
      const updated = await updateProfile({
        name: trimmedName,
        ...(user.accountType === "business" ? { vatNumber: normalizedVat } : {}),
      });
      setUser(updated);
      setIsEditing(false);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update profile.";
      if (user.accountType === "business" && isVatRelatedError(message)) {
        setVatError(message);
      } else {
        setProfileError(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyVat = async () => {
    if (!user?.vatNumber || isVerifying) return;

    const formatError = validateBelgianVat(user.vatNumber);
    if (formatError) {
      setVerifyError(formatError);
      return;
    }

    setVerifyError(null);
    setIsVerifying(true);
    try {
      await verifyVat(user.vatNumber);
      setUser(getAuthUser());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to verify VAT number.";
      setVerifyError(isVatRelatedError(message) ? message : message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-24 text-sm text-muted-foreground">
          Loading your account...
        </main>
        <Footer />
      </div>
    );
  }

  const vatDigits = getVatDigitCount(editVatNumber);
  const nameLabel = user.accountType === "business" ? "Business Name" : "Full Name";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans">
      <main className="relative z-10 w-full rounded-b-3xl bg-background shadow-2xl">
        <Header />

        <section className="bg-gradient-to-b from-muted to-background pt-24 pb-10">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">My Account</h1>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6 lg:px-8">
            {profileSuccess && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
                <p className="inline-flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {profileSuccess}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {user.accountType} account
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 space-y-4 border-t border-border pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">{nameLabel}</Label>
                    <Input
                      id="profile-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={isSaving}
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      value={user.email}
                      disabled
                      className="opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here. Contact support if you need to update it.
                    </p>
                  </div>

                  {user.accountType === "business" && (
                    <div className="space-y-2">
                      <Label htmlFor="profile-vat">VAT Number</Label>
                      <Input
                        id="profile-vat"
                        value={editVatNumber}
                        onChange={(e) => handleVatChange(e.target.value)}
                        disabled={isSaving}
                        placeholder="BE0123456789"
                        aria-invalid={Boolean(vatError)}
                      />
                      <p className="text-xs text-muted-foreground">
                        BE + 10 digits — {vatDigits}/10 digits
                      </p>
                      {vatError && (
                        <p className="text-xs text-destructive">{vatError}</p>
                      )}
                    </div>
                  )}

                  {profileError && (
                    <p className="text-sm text-destructive">{profileError}</p>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button onClick={() => void handleSaveProfile()} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={cancelEditing} disabled={isSaving}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {user.accountType === "business" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">VAT Details</h3>

                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">VAT Number</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {user.vatNumber || "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-2">
                      {user.vatVerified ? (
                        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                          <p className="inline-flex items-center gap-2 font-medium text-foreground">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            Verified — {user.companyName || user.name}
                          </p>
                          {user.companyAddress && (
                            <p className="mt-2 text-muted-foreground">{user.companyAddress}</p>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-300/50 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                          <p className="inline-flex items-center gap-2 font-medium text-foreground">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            Not Verified
                          </p>
                          <Button
                            className="mt-3"
                            size="sm"
                            onClick={() => void handleVerifyVat()}
                            disabled={isVerifying || !user.vatNumber}
                          >
                            {isVerifying ? "Verifying..." : "Verify Now"}
                          </Button>
                          {verifyError && (
                            <p className="mt-2 text-xs text-destructive">{verifyError}</p>
                          )}
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/orders">My Orders</Link>
              </Button>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
