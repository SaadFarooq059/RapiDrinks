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
import { clearAuthUser, isAuthenticated } from "@/lib/dummy-auth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setAuthed(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container px-2 mx-auto max-w-7xl">
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
                <Link href="/products" aria-label="Cart">
                  <ShoppingCart className="w-5 h-5" />
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
              <Button
                variant="secondary"
                asChild
                className="cursor-pointer bg-secondary p-0 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <Link href="/contact" className="flex items-center">
                  <span className="pl-4 py-2 text-sm font-medium">Get a Quote</span>
                  <div className="rounded-full flex items-center justify-center bg-background w-9 h-9 ml-2 group-hover:scale-105 transition-transform duration-300 border border-border/50">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50"
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
                    <Link href="/products">
                      <ShoppingCart className="w-4 h-4" />
                      Browse Products
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
