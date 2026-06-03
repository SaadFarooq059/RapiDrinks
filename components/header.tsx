"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, LogIn, LogOut, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AUTH_UPDATED_EVENT,
  isAuthenticated,
  signOut,
} from "@/lib/dummy-auth";
import { CART_UPDATED_EVENT, getCartCount } from "@/lib/cart";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Promos", href: "/promos" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [authed, setAuthed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncHeaderState = async () => {
      setAuthed(isAuthenticated());
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

    const syncHeaderStateSafe = () => {
      void syncHeaderState();
    };

    syncHeaderStateSafe();
    window.addEventListener(AUTH_UPDATED_EVENT, syncHeaderStateSafe);
    window.addEventListener(CART_UPDATED_EVENT, syncHeaderStateSafe);
    window.addEventListener("storage", syncHeaderStateSafe);

    return () => {
      window.removeEventListener(AUTH_UPDATED_EVENT, syncHeaderStateSafe);
      window.removeEventListener(CART_UPDATED_EVENT, syncHeaderStateSafe);
      window.removeEventListener("storage", syncHeaderStateSafe);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAuthed(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-2 bg-background/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between p-3 lg:p-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Rapid Drinks"
                width={140}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Button 
                  key={item.name} 
                  variant="ghost" 
                  asChild
                  className="cursor-pointer hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild className="hover:text-primary transition-colors">
                <Link href="/cart" aria-label="Cart" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              {authed ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary transition-colors"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" asChild className="hover:text-primary transition-colors">
                  <Link href="/signin" aria-label="Sign in">
                    <LogIn className="w-5 h-5" />
                  </Link>
                </Button>
              )}
            </div>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] max-w-[400px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50"
              >
                <SheetHeader className="p-6 text-left border-b border-border/50">
                  <SheetTitle className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                      <Image
                        src="/images/logo.png"
                        alt="Rapid Drinks"
                        width={140}
                        height={50}
                        className="h-12 w-auto"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 gap-1">
                  {navigation.map((item) => (
                    <Button 
                      key={item.name}
                      variant="ghost" 
                      asChild
                      className="justify-start px-2 h-12 text-base font-medium hover:bg-accent/50 hover:text-primary transition-colors"
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </Button>
                  ))}
                </nav>
                <Separator className="mx-6" />
                <div className="p-6 flex flex-col gap-4">
                  <Button variant="outline" asChild className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors">
                    <Link href="/cart">
                      <ShoppingCart className="w-4 h-4" />
                      View Cart {cartCount > 0 ? `(${cartCount})` : ""}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors">
                    <Link href="/signin">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                  </Button>
                  {authed && (
                    <Button
                      variant="outline"
                      className="justify-start gap-2 h-12 hover:bg-accent/50 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  )}
                </div>
                <Separator className="mx-6" />
                <div className="p-6">
                  <Button asChild className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Link href="/contact">
                      Contact Us
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
