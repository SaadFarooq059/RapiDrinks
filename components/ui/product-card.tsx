"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  tagline: string;
  price: number;
  currency?: string;
  isCouponPrice?: boolean;
  originalPrice?: number;
  offerText: string;
  category?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      tagline,
      price,
      currency = "€",
      isCouponPrice = false,
      originalPrice,
      offerText,
      category,
      ...props
    },
    ref
  ) => {
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat("de-BE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      })
        .format(amount)
        .replace("€", `${currency}`);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg",
          className
        )}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {category}
          </div>
        )}

        {/* Product Image */}
        <div className="relative mb-4 flex h-48 w-full items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-grow flex-col items-center gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{tagline}</p>
        </div>

        {/* Pricing and Offers */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{formatPrice(price)}</span>
            {isCouponPrice && (
              <span className="text-xs font-medium text-primary">
                Wholesale Price
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
            {originalPrice && (
              <span className="text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="font-semibold text-accent">
              {offerText}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
