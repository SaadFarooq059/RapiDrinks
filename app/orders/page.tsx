"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getOrders, type OrderListItem, type PaymentStatus } from "@/lib/orders";
import { isAuthenticated } from "@/lib/dummy-auth";

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const config = {
    paid: { label: "Paid", icon: CheckCircle, className: "text-primary" },
    pending: { label: "Pending", icon: Clock, className: "text-muted-foreground" },
    failed: { label: "Failed", icon: XCircle, className: "text-destructive" },
    expired: { label: "Expired", icon: XCircle, className: "text-destructive" },
  }[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="inline-flex items-center gap-1 text-xs font-normal">
      <Icon className={`h-3.5 w-3.5 ${config.className}`} />
      {config.label}
    </Badge>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isAuthenticated()) {
        router.replace(`/signin?next=${encodeURIComponent("/orders")}`);
        return;
      }

      try {
        const result = await getOrders();
        if (!isMounted) return;
        setOrders(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load your orders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans">
      <main className="relative z-10 w-full rounded-b-3xl bg-background shadow-2xl">
        <Header />

        <section className="bg-gradient-to-b from-muted to-background pt-24 pb-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
              My Orders
            </h1>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6 lg:px-8">
            {isLoading && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Loading your orders...
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
                {error}
              </div>
            )}

            {!isLoading && !error && orders.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold text-foreground">No orders yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once you place an order it will appear here.
                </p>
                <Button className="mt-5" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            )}

            {!isLoading &&
              !error &&
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">Order #{order.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.createdAt ? formatDate(order.createdAt) : "—"}
                        {order.paymentMethod
                          ? ` · ${order.paymentMethod.charAt(0).toUpperCase()}${order.paymentMethod.slice(1)}`
                          : ""}
                      </p>
                      <div className="mt-2">
                        <PaymentBadge status={order.paymentStatus} />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
