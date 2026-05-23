"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, Lock } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CART_UPDATED_EVENT,
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";
import { AUTH_UPDATED_EVENT, isAuthenticated } from "@/lib/dummy-auth";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [authed, setAuthed] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => {
    const syncState = () => {
      setItems(getCartItems());
      setAuthed(isAuthenticated());
    };

    syncState();
    window.addEventListener(CART_UPDATED_EVENT, syncState);
    window.addEventListener(AUTH_UPDATED_EVENT, syncState);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncState);
      window.removeEventListener(AUTH_UPDATED_EVENT, syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleCheckout = () => {
    if (!authed || items.length === 0 || isCheckingOut) return;
    setCheckoutDone(false);
    setIsCheckingOut(true);

    window.setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setCheckoutDone(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans">
      <main className="relative z-10 w-full rounded-b-3xl bg-background shadow-2xl">
        <Header />

        <section className="bg-gradient-to-b from-muted to-background pt-24 pb-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
              Your Cart
            </h1>
            <p className="mt-3 text-muted-foreground">
              Add products from catalog, update quantities, and proceed with dummy checkout.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3 lg:px-8">
            <div className="space-y-4 lg:col-span-2">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Cart is empty</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add products from the catalog to start an order.
                  </p>
                  <Button className="mt-5" asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">{item.categoryLabel}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Article: {item.id}</p>
                        <Badge variant="secondary" className="mt-2 text-xs font-normal">
                          Min order: {item.minOrder} crates
                        </Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() =>
                            updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-12 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {authed ? (
                        <p className="text-base font-semibold text-foreground">
                          EUR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      ) : (
                        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          Price locked
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="text-foreground">{totalUnits}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  {authed ? (
                    <span className="font-semibold text-foreground">
                      EUR {subtotal.toFixed(2)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" />
                      Sign in to view
                    </span>
                  )}
                </p>
              </div>

              {!authed && (
                <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  Sign in or sign up to view prices and place your order.
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" asChild>
                      <Link href="/signin?next=/cart">Sign In</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/signup?next=/cart">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              )}

              <Button
                className="mt-5 w-full"
                disabled={!authed || items.length === 0 || isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? "Processing..." : "Dummy Checkout"}
              </Button>

              {checkoutDone && (
                <p className="mt-3 text-xs text-primary">
                  Order placed (dummy). Stripe/payment gateway can be connected later.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
