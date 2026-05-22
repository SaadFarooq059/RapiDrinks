import { LogoCloud } from "@/components/ui/logo-cloud-2";

export function TrustedBrands() {
  return (
    <section className="w-full bg-background px-4 py-16 sm:py-20 md:px-12 md:py-24">
      <div className="relative mx-auto grid max-w-5xl">
        <h2 className="mb-6 text-center font-serif font-bold text-3xl text-foreground tracking-tight md:text-4xl">
          Companies we <span className="font-semibold text-primary">collaborate</span> with.
        </h2>
        <LogoCloud />
      </div>
    </section>
  );
}
