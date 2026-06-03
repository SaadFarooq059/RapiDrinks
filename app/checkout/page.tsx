"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatCurrency, startCheckout } from "@/lib/orders";
import { getCartItems, type CartItem } from "@/lib/cart";
import { isAuthenticated } from "@/lib/dummy-auth";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasCancelled =
    searchParams.get("canceled") !== null || searchParams.get("cancelled") !== null;
  const [items, setItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!isAuthenticated()) {
        router.replace(`/signin?next=${encodeURIComponent("/checkout")}`);
        return;
      }

      try {
        const cartItems = await getCartItems();
        if (!isMounted) return;

        if (cartItems.length === 0) {
          router.replace("/cart");
          return;
        }
        setItems(cartItems);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load your cart.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void init();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleCheckout = async () => {
    if (isRedirecting || items.length === 0) return;
    setError(null);
    setIsRedirecting(true);

    try {
      const session = await startCheckout(notes);
      if (!session.checkoutUrl) {
        throw new Error("Payment session could not be created. Please try again.");
      }
      window.location.href = session.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans">
      <main className="relative z-10 w-full rounded-b-3xl bg-background shadow-2xl">
        <Header />

        <section className="bg-gradient-to-b from-muted to-background pt-24 pb-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
              Checkout
            </h1>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {wasCancelled && (
              <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                Payment cancelled. Your cart is still here — you can try again whenever
                you&apos;re ready.
              </div>
            )}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

              {items.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {isLoading ? "Loading your order..." : "Your cart is empty."}
                </p>
              ) : (
                <>
                  <ul className="mt-4 divide-y divide-border">
                    {items.map((item) => (
                      <li
                        key={item.sku}
                        className="flex items-start justify-between gap-3 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.packType === "crate"
                              ? `Crate · ${item.sizeLabel || ""}`.trim()
                              : item.sizeLabel || "Single"}{" "}
                            × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="order-notes"
                      className="text-sm font-medium text-foreground"
                    >
                      Delivery notes <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      id="order-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="e.g. Leave at reception, deliver after 10 AM"
                      disabled={isRedirecting}
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                    />
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="mt-5 w-full"
                    onClick={handleCheckout}
                    disabled={isRedirecting || isLoading}
                  >
                    {isRedirecting ? "Redirecting to secure payment..." : "Pay with Stripe"}
                  </Button>

                  <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    You&apos;ll be redirected to Stripe&apos;s secure checkout page.
                  </p>

                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/cart">Back to Cart</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
