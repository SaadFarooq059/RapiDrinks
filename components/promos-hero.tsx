"use client";

import React, { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PromosHeroProps {
  className?: string;
}

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function PromosHero({ className }: PromosHeroProps) {
  const [isHovered, setIsHovered] = useState(false);
  const gridBackgroundStyle: React.CSSProperties = {
    backgroundImage:
      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)",
    backgroundSize: "3rem 3rem",
  };

  return (
    <section className={cn("relative w-full overflow-hidden bg-background px-4 py-12 md:px-6", className)}>
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="relative isolate overflow-hidden rounded-[40px] border border-border bg-card shadow-sm md:rounded-[48px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 opacity-25" style={gridBackgroundStyle} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-primary/5 to-background/40" />
          <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#036929"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center md:min-h-[600px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Weekly Promo Intelligence
            </div>

            <h1 className="mb-8 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Better deals,
              <br />
              <span className="text-foreground/80">delivered faster.</span>
            </h1>

            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Discover limited-time wholesale promotions curated for bars, restaurants, hotels, and retailers.
              Unlock margins with every order.
            </p>

            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full px-12 text-base transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20"
            >
              <Link href="/products">
                View Current Promos
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
