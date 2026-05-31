import Link from "next/link";
import { Gift, CalendarDays, PackageCheck, Tag } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { PromosHero } from "@/components/promos-hero";
import { SlideToUnlock } from "@/components/ui/reward-card";

const promos = [
  {
    title: "Case Discount - Belgian Beers",
    description: "Save more on volume orders across selected beer crates.",
    validity: "Valid through June 30, 2026",
  },
  {
    title: "Mixers Bundle Offer",
    description: "Bundle selected mixers and get better wholesale margins.",
    validity: "Valid through July 15, 2026",
  },
  {
    title: "Soft Drinks Launch Promo",
    description: "Special introductory rates on newly added soft drinks.",
    validity: "Limited stock promo",
  },
];

export default function PromosPage() {
  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
        <Header />

        <PromosHero />

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {promos.map((promo) => (
              <SlideToUnlock
                key={promo.title}
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
