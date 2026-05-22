import Link from "next/link";
import {
  Users,
  Target,
  Heart,
  Globe,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "We source only the finest beverages from trusted producers worldwide, ensuring every product meets our exacting standards.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description:
      "Your success is our success. We build lasting partnerships by understanding and exceeding your needs.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "We prioritize eco-friendly practices, from sustainable packaging to carbon-neutral delivery routes.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "Constantly evolving our selection and services to bring you the latest trends and timeless classics.",
  },
];

const timeline = [
  {
    year: "2010",
    title: "Founded in Brussels",
    description:
      "Rapid Drinks was established with a vision to revolutionize wholesale beverage distribution in Belgium.",
  },
  {
    year: "2013",
    title: "Expanded Operations",
    description:
      "Opened our first dedicated warehouse facility, tripling our storage capacity and product range.",
  },
  {
    year: "2016",
    title: "Digital Transformation",
    description:
      "Launched our online ordering platform, making it easier than ever for clients to browse and order.",
  },
  {
    year: "2019",
    title: "500+ Partners",
    description:
      "Reached a milestone of serving over 500 restaurants, bars, and hotels across Belgium.",
  },
  {
    year: "2022",
    title: "Sustainability Pledge",
    description:
      "Committed to carbon-neutral deliveries and sustainable packaging across all operations.",
  },
  {
    year: "2024",
    title: "Continued Growth",
    description:
      "Expanding our premium spirits collection and launching same-day delivery in Brussels.",
  },
];

const team = [
  {
    name: "Marc Dubois",
    role: "Founder & CEO",
    bio: "25 years of experience in the beverage industry. Passionate about connecting great producers with great establishments.",
  },
  {
    name: "Sophie Van den Berg",
    role: "Head of Operations",
    bio: "Ensures seamless logistics and delivery. Former supply chain director at a major European distributor.",
  },
  {
    name: "Pierre Laurent",
    role: "Master Sommelier",
    bio: "Curates our wine selection with expertise gained from 15 years in Michelin-starred restaurants.",
  },
  {
    name: "Emma Claessens",
    role: "Client Relations Director",
    bio: "Dedicated to building lasting partnerships. Known for her personalized approach to client service.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
      <Header />

      {/* Hero */}
      <section className="relative bg-primary pt-24 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
              Passionate About Premium Beverages
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed">
              Since 2010, Rapid Drinks has been Belgium&apos;s trusted partner for
              wholesale beverage distribution. We combine industry expertise
              with exceptional service to help your business thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="rounded-2xl bg-muted p-8 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                To empower hospitality businesses across Belgium with access to
                the world&apos;s finest beverages, delivered with unmatched
                reliability and service. We believe that great drinks create
                great experiences, and we&apos;re here to make that happen for every
                establishment we serve.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary p-8 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">
                Our Vision
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                To be the most trusted and innovative wholesale beverage
                supplier in Europe, setting the standard for quality, service,
                and sustainability. We envision a future where every bar,
                restaurant, and hotel can effortlessly access premium beverages
                that delight their guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              These principles guide everything we do at Rapid Drinks
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-card p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24" id="story">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              From a small Brussels startup to Belgium&apos;s leading wholesale
              beverage supplier
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden lg:block" />
            <div className="flex flex-col gap-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`lg:w-1/2 ${
                      index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    <div className="rounded-2xl bg-card p-6 shadow-sm">
                      <span className="inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                        {item.year}
                      </span>
                      <h3 className="mt-4 font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
                    <div className="h-4 w-4 rounded-full bg-accent border-4 border-background" />
                  </div>
                  <div className="lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Meet Our Leadership
            </h2>
            <p className="mt-4 text-muted-foreground">
              The passionate experts behind Rapid Drinks
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary/30" />
                </div>
                <h3 className="mt-6 font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24" id="careers">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-primary p-8 lg:p-16 text-center">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
              Join Our Growing Team
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              We&apos;re always looking for passionate individuals to join our team.
              If you love great beverages and exceptional service, we&apos;d love to
              hear from you.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
