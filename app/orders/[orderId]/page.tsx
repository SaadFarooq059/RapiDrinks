"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, Receipt, XCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatCurrency, getOrder, type Order } from "@/lib/orders";
import { isAuthenticated } from "@/lib/dummy-auth";

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 12;

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params?.orderId) ? params.orderId[0] : params?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const pollsRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchOrder = useCallback(
    async (id: string) => {
      try {
        const result = await getOrder(id);
        if (!mountedRef.current) return;
        setOrder(result);

        if (result.paymentStatus === "pending" && pollsRef.current < MAX_POLLS) {
          setIsPolling(true);
          pollsRef.current += 1;
          timeoutRef.current = setTimeout(() => {
            void fetchOrder(id);
          }, POLL_INTERVAL_MS);
        } else {
          setIsPolling(false);
        }
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : "Unable to load this order.");
        setIsPolling(false);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    if (!isAuthenticated()) {
      router.replace(`/signin?next=${encodeURIComponent(`/orders/${orderId ?? ""}`)}`);
      return;
    }
    if (!orderId) {
      setError("Order not found.");
      setIsLoading(false);
      return;
    }

    void fetchOrder(orderId);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [orderId, router, fetchOrder]);

  const handleRefresh = () => {
    if (!orderId) return;
    pollsRef.current = 0;
    setIsLoading(true);
    void fetchOrder(orderId);
  };

  const paymentStatus = order?.paymentStatus ?? "pending";
  const isPaid = paymentStatus === "paid";
  const isFailed = paymentStatus === "failed" || paymentStatus === "expired";
  const isPending = paymentStatus === "pending";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans">
      <main className="relative z-10 w-full rounded-b-3xl bg-background shadow-2xl">
        <Header />

        <section className="pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {isLoading && !order && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Loading order...
              </div>
            )}

            {error && !order && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
                {error}
                <div className="mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/orders">Back to Orders</Link>
                  </Button>
                </div>
              </div>
            )}

            {order && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                      isPaid
                        ? "bg-primary text-primary-foreground"
                        : isFailed
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPaid ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : isFailed ? (
                      <XCircle className="h-8 w-8" />
                    ) : (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    )}
                  </div>
                  <h1 className="mt-4 font-serif text-2xl font-bold text-foreground sm:text-3xl">
                    {isPaid
                      ? "Order Confirmed!"
                      : isFailed
                      ? paymentStatus === "expired"
                        ? "Payment Session Expired"
                        : "Payment Failed"
                      : isPolling
                      ? "Confirming your payment..."
                      : "Payment Processing"}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">Order #{order.id}</p>

                  {isPending && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {isPolling
                        ? "This usually takes just a few seconds."
                        : "We haven't received confirmation yet. It may take a moment to finalize."}
                    </p>
                  )}
                  {isFailed && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your payment didn&apos;t go through. Your cart is still saved, so you
                      can try again.
                    </p>
                  )}
                </div>

                <ul className="mt-6 divide-y divide-border border-t border-border">
                  {order.items.map((item) => (
                    <li
                      key={item.sku || item.name}
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
                        {formatCurrency(item.lineTotal, order.currency)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(order.total, order.currency)}
                  </span>
                </div>

                {order.notes && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Notes:</span> {order.notes}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {isPaid && order.receiptUrl && (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                        <Receipt className="mr-2 h-4 w-4" />
                        View Receipt
                      </a>
                    </Button>
                  )}

                  {isFailed && (
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/checkout">Retry Payment</Link>
                    </Button>
                  )}

                  {isPending && !isPolling && (
                    <Button onClick={handleRefresh} className="w-full sm:w-auto">
                      Refresh Status
                    </Button>
                  )}

                  <Button asChild variant={isPaid ? "default" : "outline"} className="w-full sm:w-auto">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full sm:w-auto">
                    <Link href="/orders">My Orders</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
