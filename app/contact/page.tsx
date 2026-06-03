"use client";

import { useState } from "react";
import { MapPin, Mail, Send, CheckCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api-client";

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiRequest("/contact/inquiries", {
        method: "POST",
        body: formState,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your inquiry.");
    }
  };

  return (
    <div className="relative w-full bg-background min-h-screen font-sans overflow-x-hidden">
      <main className="relative z-10 w-full bg-background rounded-b-3xl shadow-2xl">
        <Header />

        {/* Simple Hero */}
        <section className="bg-gradient-to-b from-muted/60 to-background pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Tell us what you need and our team will reply by email with the right products and
                wholesale guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Redesigned Contact Layout */}
        <section className="pb-16 pt-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <aside className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">Email Us</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  For all inquiries, please use our official email address.
                </p>
                <a
                  href="mailto:info@rapiddrinks.be"
                  className="mt-4 inline-flex text-base font-semibold text-primary hover:text-primary/80"
                >
                  info@rapiddrinks.be
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground">What happens next?</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>We review your request and product requirements.</li>
                  <li>Our team responds by email as soon as possible.</li>
                  <li>You receive suitable product and ordering guidance.</li>
                </ul>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex aspect-video items-center justify-center bg-muted">
                  <div className="text-center">
                    <MapPin className="mx-auto h-10 w-10 text-primary/40" />
                    <p className="mt-2 text-sm text-muted-foreground">Rue Bara 129, 1070 Anderlecht</p>
                  </div>
                </div>
              </div>
            </aside>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2" id="contact-form">
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Send Your Inquiry
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and we will reply by email.
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
                    We&apos;ve received your inquiry and will reply through email soon.
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
                  {error && (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
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
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone Number (optional)</Label>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
