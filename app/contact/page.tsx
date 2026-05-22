"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  FileText,
  Send,
  CheckCircle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Rapid Drinks HQ", "Avenue Louise 123", "1050 Brussels, Belgium"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+32 2 123 4567", "+32 2 123 4568 (Orders)", "Mon-Fri: 8am-6pm"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: [
      "info@rapiddrinks.be",
      "orders@rapiddrinks.be",
      "support@rapiddrinks.be",
    ],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      "Monday - Friday: 8am - 6pm",
      "Saturday: 9am - 2pm",
      "Sunday: Closed",
    ],
  },
];

const businessTypes = [
  "Restaurant",
  "Bar / Pub",
  "Hotel",
  "Retail Store",
  "Event Venue",
  "Other",
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-muted to-background pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-muted-foreground">
              Ready to elevate your beverage selection? Contact us for a
              personalized quote or to learn more about our services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-card p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {item.title}
                </h3>
                <div className="mt-2 flex flex-col gap-1">
                  {item.details.map((detail, index) => (
                    <span key={index} className="text-sm text-muted-foreground">
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Additional Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Request a Quote
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              {isSubmitted ? (
                <div className="mt-8 rounded-2xl bg-primary/5 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    Thank You!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    We&apos;ve received your inquiry and will contact you within 24
                    hours.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormState({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        businessType: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                        placeholder="+32 XXX XXX XXX"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        required
                        value={formState.company}
                        onChange={(e) =>
                          setFormState({ ...formState, company: e.target.value })
                        }
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select
                      id="businessType"
                      required
                      value={formState.businessType}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          businessType: e.target.value,
                        })
                      }
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select your business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Tell us about your beverage needs, volumes, and any specific products you're interested in..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-8">
              {/* Delivery Info */}
              <div className="rounded-2xl bg-secondary p-8" id="delivery">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  Delivery Information
                </h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Same-Day Delivery:</strong>{" "}
                      Available in Brussels for orders placed before 10am
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Next-Day Delivery:</strong>{" "}
                      Available across Belgium for orders placed before 4pm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Free Delivery:</strong>{" "}
                      On orders over €500 (excl. VAT)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Temperature Controlled:</strong>{" "}
                      All deliveries in climate-controlled vehicles
                    </span>
                  </li>
                </ul>
              </div>

              {/* Wholesale Terms */}
              <div className="rounded-2xl bg-muted p-8" id="terms">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  Wholesale Terms
                </h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Minimum Order:</strong>{" "}
                      €200 for first orders, €100 for repeat customers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Payment Terms:</strong>{" "}
                      NET 30 for established accounts, COD for new customers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Volume Discounts:</strong>{" "}
                      5% off orders over €1,000, 10% off orders over €5,000
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Returns:</strong>{" "}
                      Full refund on damaged goods, 14-day return policy
                    </span>
                  </li>
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary/30 mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Avenue Louise 123, Brussels
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
