"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Beer,
  Martini,
  GlassWater,
  ShoppingCart,
  Lock,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AUTH_UPDATED_EVENT, isAuthenticated } from "@/lib/dummy-auth";
import { CART_UPDATED_EVENT, addToCart, getCartCount } from "@/lib/cart";
import { apiRequest } from "@/lib/api-client";

type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number | null;
  minOrder: number;
  status: string;
  tags: string[];
  imageUrl?: string;
};

type Category = {
  id: string;
  name: string;
  icon: typeof Beer | typeof Martini | typeof GlassWater | null;
};

type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  label: string;
};

type ProductsResponse = {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

const PRODUCTS_PER_PAGE = 12;

const CATEGORY_ALIAS: Record<string, string> = {
  wines: "soft-drinks",
  spirits: "mixers",
  beers: "beer",
  "non-alcoholic": "soft-drinks",
};

function getCategoryIcon(categoryLabel: string): Category["icon"] {
  const normalized = categoryLabel.toLowerCase();
  if (normalized.includes("beer")) return Beer;
  if (normalized.includes("mixer")) return Martini;
  return GlassWater;
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "All Products", icon: null },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [canViewPrices, setCanViewPrices] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cartActionError, setCartActionError] = useState<string | null>(null);

  useEffect(() => {
    const syncAuthAndCart = async () => {
      setCanViewPrices(isAuthenticated());
      if (!isAuthenticated()) {
        setCartCount(0);
        return;
      }
      try {
        const count = await getCartCount();
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    const syncAuthAndCartSafe = () => {
      void syncAuthAndCart();
    };

    syncAuthAndCartSafe();
    window.addEventListener(AUTH_UPDATED_EVENT, syncAuthAndCartSafe);
    window.addEventListener(CART_UPDATED_EVENT, syncAuthAndCartSafe);
    window.addEventListener("storage", syncAuthAndCartSafe);

    return () => {
      window.removeEventListener(AUTH_UPDATED_EVENT, syncAuthAndCartSafe);
      window.removeEventListener(CART_UPDATED_EVENT, syncAuthAndCartSafe);
      window.removeEventListener("storage", syncAuthAndCartSafe);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await apiRequest<{ items: ApiCategory[] }>("/categories");
        if (!isMounted) return;
        const mapped = response.items.map((category) => ({
          id: category.id || category.slug,
          name: category.label || category.name,
          icon: getCategoryIcon(category.label || category.name),
        }));
        setCategories([{ id: "all", name: "All Products", icon: null }, ...mapped]);
      } catch (error) {
        if (!isMounted) return;
        setCategories([{ id: "all", name: "All Products", icon: null }]);
        setLoadError(error instanceof Error ? error.message : "Unable to load categories.");
      }
    };

    void loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(PRODUCTS_PER_PAGE));
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }
        if (activeCategory !== "all") {
          params.set("category", activeCategory);
        }
        const response = await apiRequest<ProductsResponse>(`/products?${params.toString()}`);
        if (!isMounted) return;
        setProducts(response.items);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(Math.max(1, response.pagination.totalPages));
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load products.");
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, [activeCategory, currentPage, searchQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrlRaw = new URLSearchParams(window.location.search).get("category");
    if (!fromUrlRaw) return;
    const fromUrl = CATEGORY_ALIAS[fromUrlRaw.toLowerCase()] || fromUrlRaw.toLowerCase();
    const exists = categories.some((category) => category.id === fromUrl);
    if (exists) {
      setActiveCategory(fromUrl);
    }
  }, [categories]);

  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    if (!canViewPrices || product.price === null) return;
    setCartActionError(null);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        categoryLabel: product.categoryLabel,
        price: product.price,
        minOrder: product.minOrder,
        quantity: product.minOrder,
      });
      setLastAddedProductId(product.id);
      window.setTimeout(() => setLastAddedProductId(null), 1200);
    } catch (error) {
      setCartActionError(error instanceof Error ? error.message : "Unable to add to cart.");
    }
  };

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-background via-muted/30 to-background py-12 sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="lg:w-2/3">
              <p className="text-xs font-normal uppercase tracking-widest text-muted-foreground sm:text-sm">
                Wholesale Catalog for Bars, Hotels and Retailers
              </p>
              <h1 className="mt-6 font-serif text-4xl font-medium text-foreground sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Unlimited Beverage
                </span>{" "}
                Selection
              </h1>
              <p className="mt-4 max-w-xl text-base font-normal text-muted-foreground sm:mt-8 sm:text-xl">
                Explore our fast-moving product catalog, add items to cart, and place your order
                with dummy checkout. Sign in to unlock prices and complete orders.
              </p>
            </div>

            <div className="mt-8 md:absolute md:right-0 md:top-32 md:mt-0 lg:top-0">
              <img
                className="mx-auto w-full max-w-xs lg:max-w-lg xl:max-w-xl"
                src="/product.jpg"
                alt="Catalog visual"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mx-auto mb-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-card pl-12"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.icon && <category.icon className="h-4 w-4" />}
                {category.name}
              </button>
            ))}
          </div>

          {/* Product Count */}
          <p className="mt-8 text-sm text-muted-foreground">
            Showing{" "}
            {totalItems === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1}
            -
            {Math.min(currentPage * PRODUCTS_PER_PAGE, totalItems)} of {totalItems} matching products
          </p>
          {!canViewPrices && (
            <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Prices are hidden. Sign in or sign up to view them.
              </span>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/signin?next=/products">Sign In</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/signup?next=/products">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
          <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Cart has {cartCount} item{cartCount === 1 ? "" : "s"}.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href="/cart">Open Cart</Link>
            </Button>
          </div>
          {cartActionError && (
            <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {cartActionError}
            </div>
          )}

          {isLoading && (
            <div className="mt-6 text-sm text-muted-foreground">
              Loading products from catalog...
            </div>
          )}

          {loadError && (
            <div className="mt-6 text-sm text-destructive">
              {loadError}
            </div>
          )}

          {/* Product Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Product Image Placeholder */}
                <div className="aspect-square rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    {product.category.includes("beer") && (
                      <Beer className="h-16 w-16 text-primary/30 mx-auto" />
                    )}
                    {product.category.includes("mixer") && (
                      <Martini className="h-16 w-16 text-primary/30 mx-auto" />
                    )}
                    {!product.category.includes("beer") && !product.category.includes("mixer") && (
                      <GlassWater className="h-16 w-16 text-primary/30 mx-auto" />
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Product Info */}
                <h3 className="mt-3 font-semibold text-foreground line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.categoryLabel}</p>

                <p className="text-xs text-muted-foreground">Min. order: {product.minOrder} crates</p>
                <div className="mt-3">
                  {product.price !== null ? (
                    <p className="text-xl font-bold text-foreground">EUR {product.price.toFixed(2)}</p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground inline-flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <Link href="/signin?next=/products" className="text-primary hover:underline">
                        Login to see price
                      </Link>
                    </p>
                  )}
                </div>

                {/* Action */}
                <Button
                  className="mt-4 w-full"
                  variant={lastAddedProductId === product.id ? "default" : "outline"}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.price === null}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.price === null
                    ? "Login to Add"
                    : lastAddedProductId === product.id
                    ? "Added"
                    : "Add to Cart"}
                </Button>
              </div>
            ))}
          </div>

          {!isLoading && products.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </Button>

              {visiblePages[0] > 1 && (
                <>
                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(1)}>
                    1
                  </Button>
                  {visiblePages[0] > 2 && (
                    <span className="px-2 text-sm text-muted-foreground">...</span>
                  )}
                </>
              )}

              {visiblePages.map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-sm text-muted-foreground">...</span>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && products.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                No products found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our catalog includes over 1,200 products. Contact us for specific
              requests or to discuss your unique requirements.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
