"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, CalendarDays, PackageCheck, Tag } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { PromosHero } from "@/components/promos-hero";
import { SlideToUnlock } from "@/components/ui/reward-card";
import { apiRequest } from "@/lib/api-client";

type Promo = {
  id?: string;
  title: string;
  description: string;
  validity: string;
};

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPromos = async () => {
      try {
        const response = await apiRequest<{ items: Array<Record<string, unknown>> }>("/promos");
        if (!isMounted) return;
        const mapped = response.items.map((promo, idx) => ({
          id: String(promo.id ?? idx),
          title: String(promo.title ?? "Promo"),
          description: String(promo.description ?? ""),
          validity: String(
            promo.validity ??
              promo.validUntil ??
              promo.expiresAt ??
              "Limited stock promo"
          ),
        }));
        setPromos(mapped);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load promos.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
        <Header />

        <PromosHero />

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {isLoading && <p className="text-sm text-muted-foreground">Loading promos...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!isLoading &&
              !error &&
              promos.map((promo) => (
              <SlideToUnlock
                key={promo.id || promo.title}
                sliderText="Slide to unlock this promo"
                unlockedContent={
                  <div className="mt-6 flex h-14 w-full items-center justify-between rounded-full bg-primary px-3 text-primary-foreground shadow-md">
                    <div className="pl-2">
                      <p className="text-sm font-bold">Promo Unlocked</p>
                      <p className="text-xs opacity-90">{promo.validity}</p>
                    </div>
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <Link href="/contact">Claim</Link>
                    </Button>
                  </div>
                }
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                    <Gift className="h-10 w-10 text-primary" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Tag className="h-3.5 w-3.5" />
                    Promo
                  </div>
                  <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {promo.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                    {promo.description}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {promo.validity}
                  </p>
                </div>
              </SlideToUnlock>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground">Need a custom wholesale offer?</h3>
              <p className="mt-3 text-muted-foreground">
                Contact our team to request promo pricing tailored to your volume and product mix.
              </p>
              <Button asChild className="mt-6">
                <Link href="/contact">
                  <PackageCheck className="mr-2 h-4 w-4" />
                  Request Promo Quote
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
