"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { isAuthenticated } from "@/lib/dummy-auth";

type FeaturedProduct = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
};

const products: FeaturedProduct[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1586993451228-09818021e309?w=400&h=400&fit=crop",
    name: "Moët & Chandon Impérial",
    description: "Premium French Champagne with elegant notes and a refined finish.",
    price: 38.99,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop",
    name: "Johnnie Walker Black Label",
    description: "A smooth 12-year blended Scotch ideal for premium service menus.",
    price: 28.5,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop",
    name: "Château Margaux 2018",
    description: "Bordeaux Grand Cru Classé for high-end wine lists and pairings.",
    price: 299,
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop",
    name: "Stella Artois Lager",
    description: "Popular Belgian lager in wholesale-friendly packaging options.",
    price: 18.99,
  },
];

export function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [authed, setAuthed] = useState(false);
  const swipeAreaRef = useRef<HTMLDivElement>(null);

  const angleSpacing = 32;
  const arcRadius = 670;
  const verticalOffset = 230;
  const maxVisibleCards = 5;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const checkAuth = () => setAuthed(isAuthenticated());

    handleResize();
    checkAuth();
    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) handlePrev();
    if (info.offset.x < -swipeThreshold) handleNext();
  };

  const handleAddToCart = (product: FeaturedProduct) => {
    if (!authed || typeof window === "undefined") return;
    const existing = window.localStorage.getItem("rapid_drinks_cart");
    const cart: Array<{ id: number; name: string; price: number }> = existing ? JSON.parse(existing) : [];
    cart.push({ id: product.id, name: product.name, price: product.price });
    window.localStorage.setItem("rapid_drinks_cart", JSON.stringify(cart));
  };

  return (
    <motion.section
      className="py-10 md:py-16 my-6 md:my-10 bg-background relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
          Featured Products
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-1 bg-primary mt-4 mx-auto"
          style={{ width: "60%", maxWidth: "200px" }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative">
        {isMobile && (
          <div className="text-center text-muted-foreground mb-4 text-sm">
            Swipe left or right
          </div>
        )}

        <motion.div
          ref={swipeAreaRef}
          className="relative h-[500px] md:h-[550px] overflow-visible"
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <div className="absolute left-2 md:left-10 top-1/2 transform -translate-y-1/2 z-[110]">
            <button
              onClick={handlePrev}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <div className="absolute right-2 md:right-10 top-1/2 transform -translate-y-1/2 z-[110]">
            <button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {products.map((product, idx) => {
            const normalizedIdx = (idx - currentIndex + products.length) % products.length;
            const relativeAngle =
              normalizedIdx <= products.length / 2
                ? normalizedIdx * (isMobile ? 50 : angleSpacing)
                : (normalizedIdx - products.length) * (isMobile ? 50 : angleSpacing);

            const x =
              Math.sin((relativeAngle * Math.PI) / 180) *
              (isMobile ? arcRadius * 0.6 : arcRadius);
            const y =
              (1 - Math.cos((relativeAngle * Math.PI) / 180)) *
              (isMobile ? verticalOffset * 0.7 : verticalOffset);

            const distance = Math.min(
              Math.abs(normalizedIdx),
              Math.abs(normalizedIdx - products.length)
            );

            const isVisible = distance <= (isMobile ? 1 : maxVisibleCards / 2);
            const scale = 1 - distance * (isMobile ? 0.25 : 0.18);
            const isCenter = distance === 0;

            return (
              <div
                key={product.id}
                className="absolute left-1/2 transition-all duration-700"
                style={{
                  transform: `translateX(-50%) translateX(${x}px) translateY(${y}px) scale(${scale})`,
                  opacity: isVisible ? Math.max(1 - distance * 0.2, 0.1) : 0,
                  zIndex: 100 - distance,
                  width: isMobile ? "330px" : "360px",
                  pointerEvents: isVisible ? "auto" : "none",
                  transformOrigin: "center center",
                }}
              >
                <div
                  className={`h-[480px] rounded-2xl overflow-hidden shadow-sm relative group hover:shadow-lg transition-all duration-300 bg-card ${
                    isCenter ? "ring-2 ring-primary" : "border border-border"
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div className="p-4 flex justify-center">
                      <div className="flex justify-center items-center h-40">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="object-contain w-auto h-full max-w-full"
                        />
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <h5 className={`${isMobile ? "text-lg" : "text-xl"} font-serif font-semibold line-clamp-2 text-foreground`}>
                          {product.name}
                        </h5>
                      </div>
                      <div className="mb-3">
                        <p className={`${isCenter ? "text-foreground" : "text-muted-foreground"} ${isMobile ? "text-sm" : "text-base"} line-clamp-2`}>
                          {product.description}
                        </p>
                      </div>

                      {authed ? (
                        <div className="text-center mb-3">
                          <p className="text-2xl font-bold text-foreground">
                            EUR {product.price.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center mb-3 flex items-center justify-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href="/signin?next=/products"
                            className="text-sm text-primary hover:text-primary/80 font-semibold underline"
                          >
                            Login to see price
                          </Link>
                        </div>
                      )}

                      <div className="flex justify-center mt-auto">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!authed}
                          className={`inline-flex items-center justify-center px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                            authed
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          {authed ? "Add to Cart" : "Login to Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
