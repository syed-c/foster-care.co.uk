"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import {
  FileText, CheckCircle, Users, Shield, Eye, Scale,
  AlertTriangle, Heart, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditorialPolicy() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Editorial Policy", url: "/editorial-policy" },
  ];

  const principles = [
    {
      icon: Eye,
      title: "Transparency",
      description: "We clearly distinguish between auto-generated and verified content. Every listing shows its status and source of information.",
    },
    {
      icon: Scale,
      title: "Accuracy",
      description: "We only publish information that can be verified through official sources like Ofsted registers and Google Business Profiles.",
    },
    {
      icon: Shield,
      title: "No Fabrication",
      description: "We never invent reviews, testimonials, or agency details. All content is sourced from real data or agency submissions.",
    },
    {
      icon: Heart,
      title: "Child-First Approach",
      description: "Every decision we make considers the welfare of children in care. We prioritize agencies that demonstrate quality and commitment.",
    },
    {
      icon: Users,
      title: "Fairness",
      description: "All agencies, whether verified or unclaimed, receive equal treatment in our core search results. Verified status is earned, not bought.",
    },
    {
      icon: AlertTriangle,
      title: "Responsiveness",
      description: "We investigate and respond to accuracy concerns within 48 hours. Harmful or misleading content is removed immediately.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Editorial Policy | Foster Care UK Directory"
        description="Our commitment to accuracy, transparency, and child welfare in maintaining the UK's leading foster care agency directory."
        canonicalUrl="https://fostercare.uk/editorial-policy"
        structuredData={getBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden gradient-hero">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-trust/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-2 mb-6">
                <FileText className="w-4 h-4" />
                Our Standards
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Editorial Policy
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Our commitment to accuracy, transparency, and putting children's welfare first in everything we publish.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="section-padding bg-background-warm">
          <div className="container-main max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8 md:p-12 text-center"
            >
              <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Foster Care UK exists to help connect children who need care with qualified, caring foster families.
                We achieve this by providing the most accurate, comprehensive directory of fostering agencies in England.
                Every piece of content on our platform serves this mission.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-center mb-12"
            >
              Our Core Principles
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {principles.map((principle, index) => {
                const IconComponent = principle.icon;
                return (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="card-warm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{principle.title}</h3>
                    <p className="text-muted-foreground text-sm">{principle.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Standards */}
        <section className="section-padding bg-background-sand">
          <div className="container-main max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-center mb-8"
            >
              Content Standards
            </motion.h2>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-elevated p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-3">Agency Listings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>All agencies must be registered with Ofsted or equivalent regulatory body</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>Information is sourced from official registers and verified business profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>Unclaimed profiles clearly state limitations of available information</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-3">Reviews & Ratings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>All reviews are moderated before publication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>We remove fake, defamatory, or off-topic reviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>Agencies can respond to reviews through their verified dashboard</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-3">Educational Content</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>Guides are researched and reviewed by fostering professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>We cite official sources and link to authoritative resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5 flex-shrink-0" />
                    <span>Content is regularly updated to reflect current regulations</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="container-main text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Questions or Concerns?
              </h2>
              <p className="text-secondary-foreground/80 text-lg mb-8">
                If you have questions about our editorial standards or need to report an accuracy issue, we're here to help.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-white text-secondary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>


      <BackToTop />
    </div>
  );
}
