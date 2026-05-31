"use client";

import { useRef, useEffect, forwardRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  primaryText: string;
  secondaryText: string;
  baseVelocity: number;
  className?: string;
  scrollDependent?: boolean;
  delay?: number;
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      primaryText,
      secondaryText,
      baseVelocity = -5,
      className,
      scrollDependent = false,
      delay = 0,
    },
    ref
  ) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
      clamp: false,
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    const hasStarted = useRef(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        hasStarted.current = true;
      }, delay);

      return () => clearTimeout(timer);
    }, [delay]);

    useAnimationFrame((_t, delta) => {
      if (!hasStarted.current) return;

      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (scrollDependent) {
        if (velocityFactor.get() < 0) {
          directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
          directionFactor.current = 1;
        }
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div ref={ref} className="overflow-hidden whitespace-nowrap flex flex-nowrap">
        <motion.div className="flex whitespace-nowrap gap-8 md:gap-10 flex-nowrap items-center" style={{ x }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="inline-flex shrink-0 items-center gap-4 md:gap-6 pr-4 md:pr-6">
              <img
                src="/slider.png"
                alt="Slider separator"
                className="h-12 w-12 md:h-16 md:w-16 object-contain shrink-0"
              />
              <span className={cn("block text-[8vw] shrink-0", className)}>{primaryText}</span>
              <img
                src="/slider.png"
                alt="Slider separator"
                className="h-12 w-12 md:h-16 md:w-16 object-contain shrink-0"
              />
              <span className={cn("block text-[8vw] shrink-0", className)}>{secondaryText}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export function BusinessDiscountSlider() {
  return (
    <section className="py-6 md:py-8 border-y border-border bg-muted/20">
      <Marquee
        primaryText="SPECIAL DISCOUNTS FOR BUSINESSES BUYING IN VOLUME"
        secondaryText=" CONTACT US FOR A CUSTOM OFFER"
        baseVelocity={-1.5}
        className="font-serif font-semibold text-primary/90 leading-none tracking-tight text-[5vw] md:text-[2.4vw]"
      />
    </section>
  );
}
