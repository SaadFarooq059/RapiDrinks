import { CommerceHero } from "@/components/commerce-hero";
import { Footer } from "@/components/footer";
import { FeaturedProducts } from "@/components/featured-products";
import { WhyChooseUs } from "@/components/why-choose-us";
import { CtaSectionWithGallery } from "@/components/cta-section-gallery";
import { TrustedBrands } from "@/components/trusted-brands";



export default function HomePage() {
  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      {/* Main content area - high z-index for curtain reveal effect */}
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
      {/* Commerce Hero with Header */}
      <CommerceHero />


           {/* Trusted Brands Section */}
           <TrustedBrands />

      {/* Featured Products Section */}
      <FeaturedProducts />

 

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* CTA Section with Gallery */}
      <CtaSectionWithGallery />
      </main>

      <Footer />
    </div>
  );
}
