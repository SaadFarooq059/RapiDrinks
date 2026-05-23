"use client";

import { useEffect, useState } from "react";

/**
 * Rapid Drinks animated splash screen.
 *
 * Setup:
 *   1. Put `logo-animated.svg` in your /public folder.
 *   2. Put this file in /components and mount it in app/layout.tsx:
 *
 *        import SplashScreen from "@/components/SplashScreen";
 *        ...
 *        <body>
 *          <SplashScreen />
 *          {children}
 *        </body>
 *
 * The SVG animates itself on load (speed-lines, bottle, liquid fill,
 * gauge, needle rev, wordmark). This component handles the fullscreen
 * overlay, the fade-out, and unmounting.
 */
export default function SplashScreen({
  /** Time the splash is shown before it fades out (ms). */
  duration = 3600,
  /** Show only once per browser session. */
  oncePerSession = false,
  /** Path to the animated SVG in /public. */
  src = "/logo-animated.svg",
}: {
  duration?: number;
  oncePerSession?: boolean;
  src?: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (oncePerSession && sessionStorage.getItem("rd-splash-seen")) {
      setHidden(true);
      return;
    }
    const fade = setTimeout(() => setLeaving(true), duration);
    const remove = setTimeout(() => {
      setHidden(true);
      if (oncePerSession) sessionStorage.setItem("rd-splash-seen", "1");
    }, duration + 750);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, [duration, oncePerSession]);

  if (hidden) return null;

  return (
    <div
      className={`rd-splash ${leaving ? "rd-splash--leaving" : ""}`}
      aria-hidden="true"
    >
      <img src={src} alt="Rapid Drinks" className="rd-logo" />
      <style jsx>{`
        .rd-splash {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            120% 120% at 50% 42%,
            #ffffff 0%,
            #f3f6f1 55%,
            #e8efe6 100%
          );
          overflow: hidden;
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .rd-splash--leaving {
          opacity: 0;
          transform: scale(1.05);
          pointer-events: none;
        }
        .rd-logo {
          width: min(82vw, 560px);
          height: auto;
        }
      `}</style>
    </div>
  );
}
