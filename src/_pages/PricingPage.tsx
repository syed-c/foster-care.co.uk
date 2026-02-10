"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Shield, TrendingUp, Zap, ArrowRight, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/layout/Header";

import { SEOHead } from "@/components/seo/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const planIcons = {
  "verified-presence": Shield,
  "growth-engine": TrendingUp,
  "autopilot-growth": Zap,
};

const faqs = [
  {
    question: "Why monthly-only pricing?",
    answer: "We believe in earning your trust every month. No annual lock-ins means you can pause, cancel, or adjust your plan based on your agency's needs. Growth happens month by month, and your subscription should reflect that.",
  },
  {
    question: "What happens when I cancel?",
    answer: "You keep access until the end of your billing period. Your profile remains visible in basic form, and all your data stays intact. You can re-subscribe anytime without losing your history.",
  },
  {
    question: "Do you guarantee placements or approvals?",
    answer: "No. We never make outcome guarantees. We provide the visibility, trust signals, and inquiry intelligence that help you connect with potential foster carers. The relationship and decisions are always between you and the enquirer.",
  },
  {
    question: "Do I need my own CRM or website?",
    answer: "No. Our Growth Engine and Autopilot plans include inquiry tracking and management built-in. Autopilot Growth includes a platform-hosted website, so you don't need to maintain separate systems.",
  },
  {
    question: "What is a verified inquiry?",
    answer: "A verified inquiry is a form submission, call-intent click, or chat-to-contact action where someone has expressed interest in fostering with your agency. We track the intent, not the outcome. All decisions remain with you.",
  },
  {
    question: "Who owns the content?",
    answer: "You do. Any content you create or approve on your profile, website, or reviews belongs to you. AI drafts require your explicit approval before publishing.",
  },
];

export default function PricingPage() {
  const [billingInterval] = useState<"monthly">("monthly");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price_monthly", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Fostering Agency Pricing Plans | Verified Listings | Foster Care UK"
        description="Affordable monthly plans for fostering agencies. Get verified listings, lead management, SEO optimization, and reputation management. No annual lock-ins. Cancel anytime."
        canonicalUrl="https://www.foster-care.co.uk/pricing"
        keywords={["fostering agency pricing", "foster care agency listing", "fostering agency marketing", "foster care lead generation"]}
      />
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="container-main py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-1">
              Monthly Plans Only
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Stop Chasing Visibility.
              <span className="text-primary block mt-2">Start Building Trust.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most fostering agencies struggle to be found. The ones who thrive have systems that work while they focus on what matters: supporting children.
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="rounded-3xl border-border animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                    <div className="h-10 bg-muted rounded w-2/3 mb-6" />
                    <div className="space-y-3">
                      {Array(6).fill(0).map((_, j) => (
                        <div key={j} className="h-4 bg-muted rounded w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : plans?.map((plan, index) => {
              const Icon = planIcons[plan.slug as keyof typeof planIcons] || Shield;
              const features = (plan.features as { name: string; included: boolean }[]) || [];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`rounded-3xl h-full transition-all hover:-translate-y-1 ${plan.is_popular
                      ? "border-primary shadow-glow relative overflow-visible"
                      : "border-border hover:border-primary/30 hover:shadow-card"
                      }`}
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-soft">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                      {/* Header */}
                      <div className="mb-6">
                        <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${plan.is_popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-border">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">£{plan.price_monthly}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cancel anytime. No lock-in.
                        </p>
                      </div>

                      {/* Who it's for */}
                      {plan.who_is_for && (
                        <div className="mb-6 p-4 bg-muted/50 rounded-2xl">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">WHO THIS IS FOR</p>
                          <p className="text-sm">{plan.who_is_for}</p>
                        </div>
                      )}

                      {/* Features */}
                      <div className="flex-1 space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <div className="w-5 h-5 rounded-full bg-verified/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-verified" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                            <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Button
                        className={`w-full rounded-xl ${plan.is_popular ? "" : "variant-outline"}`}
                        variant={plan.is_popular ? "default" : "outline"}
                        asChild
                      >
                        <Link href={`/register-agency?plan=${plan.slug}`}>
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Value Props */}
        <section className="bg-background-warm py-16 lg:py-24">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">What You're Really Getting</h2>
              <p className="text-muted-foreground">
                We don't sell listings. We sell trust, visibility, and the infrastructure that turns interest into action.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Trust & Authority",
                  description: "Verified badges, public reviews, and reputation management that shows potential foster carers you're the real deal.",
                },
                {
                  icon: TrendingUp,
                  title: "Visibility & Reach",
                  description: "SEO-optimized pages, UK city presence, and priority placement that puts you in front of people actively looking.",
                },
                {
                  icon: MessageSquare,
                  title: "Inquiry Intelligence",
                  description: "Track every form, call-intent, and chat. Know what's working. Stop guessing, start growing.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="container-main py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-2xl px-6 data-[state=open]:shadow-soft"
                >
                  <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-secondary text-secondary-foreground py-16 lg:py-24">
          <div className="container-main text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Grow?</h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
              Join agencies across the UK who are building trust, gaining visibility, and connecting with foster carers through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary-hover" asChild>
                <Link href="/register-agency">
                  Get Verified Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link href="/contact">Request Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
