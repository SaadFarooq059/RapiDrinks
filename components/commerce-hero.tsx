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
import { motion } from "framer-motion";
import { isAuthenticated, signOut } from "@/lib/dummy-auth";

const categories = [
  {
    title: "Wine",
    image: "/1.png",
    href: "/products?category=wine",
    count: "500+",
  },
  {
    title: "Spirits",
    image: "/2.png",
    href: "/products?category=spirits",
    count: "300+",
  },
  {
    title: "Beer",
    image: "/3.png",
    href: "/products?category=beer",
    count: "200+",
  },
  {
    title: "Soft Drinks",
    image: "/4.png",
    href: "/products?category=soft-drinks",
    count: "150+",
  },
];

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Promos", href: "/promos" },
  { name: "Contact", href: "/contact" },
];

export function CommerceHero() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAuthed(false);
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen w-full max-w-7xl container mx-auto px-4 sm:px-6">
      <div className="mt-4 sm:mt-6 bg-accent/10 rounded-2xl relative overflow-hidden min-h-[70vh] sm:min-h-[78vh]">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src="/video.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-background/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/5 to-background/22" />
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <header className="flex items-center relative z-10">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-background/95 backdrop-blur-sm p-4 rounded-br-2xl flex items-center gap-2">
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

            <nav className="hidden lg:flex items-center justify-between w-full">
              {navigation.map((item) => (
                <Button 
                  key={item.name} 
                  variant="link" 
                  asChild
                  className="cursor-pointer relative group hover:text-primary transition-colors"
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
              <Button variant="ghost" size="icon" asChild className="cursor-pointer relative group hover:text-primary transition-colors">
                <Link href="/products" aria-label="Cart">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </Button>
              {authed ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer relative group hover:text-primary transition-colors"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" asChild className="cursor-pointer relative group hover:text-primary transition-colors">
                  <Link href="/signin" aria-label="Sign in">
                    <LogIn className="w-5 h-5" />
                  </Link>
                </Button>
              )}
            </nav>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden ml-auto">
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

        </header>

        <motion.section
          className="w-full px-4 sm:px-6 py-16 sm:py-20 md:py-24 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto text-center max-w-3xl">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-5 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent font-serif">
                Premium Beverages
              </span>
              <br />
              <span className="text-foreground font-serif">
                for Your Business
              </span>
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            >
              From world-class wines to craft beers and premium spirits, we
              supply restaurants, bars, and hotels across Belgium with the
              finest beverages at wholesale prices.
            </motion.p>
            <motion.div 
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            >
              <Button size="lg" asChild className="px-8 h-12 text-base w-full sm:w-auto">
                <Link href="/products">
                  Browse Catalog
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 h-12 text-base w-full sm:w-auto">
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-12">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            className="group relative bg-muted/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[280px] sm:min-h-[320px] w-full overflow-hidden transition-all duration-500 hover:bg-muted/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          >
            <Link href={category.href} className="absolute inset-0 z-20">
              <div className="p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(1.5rem,4vw,2.5rem)] font-serif font-bold relative z-10 text-primary group-hover:text-primary/90 transition-colors duration-300">
                  {category.title}
                </h2>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-4 pt-16">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full max-w-[min(50vw,200px)] sm:max-w-[min(40vw,180px)] md:max-w-[min(30vw,160px)] lg:max-w-[min(20vw,140px)] h-auto aspect-square object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-background/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-border/50">
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
