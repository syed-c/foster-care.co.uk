"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import {
  BookOpen, ArrowRight, Clock, Users, Heart, Home,
  FileQuestion, CheckSquare, Sparkles, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const guides = [
  {
    slug: "how-to-become-foster-carer",
    title: "How to Become a Foster Carer",
    description: "A complete step-by-step guide to starting your fostering journey in England, from initial enquiry to approval.",
    icon: GraduationCap,
    readTime: "12 min read",
    category: "Getting Started",
  },
  {
    slug: "choosing-fostering-agency",
    title: "Choosing a Fostering Agency",
    description: "What to look for when selecting a fostering agency, questions to ask, and how to compare your options.",
    icon: CheckSquare,
    readTime: "8 min read",
    category: "Getting Started",
  },
  {
    slug: "types-of-fostering",
    title: "Types of Fostering Explained",
    description: "Understand the different types of fostering available, from emergency placements to long-term care.",
    icon: Users,
    readTime: "10 min read",
    category: "Understanding Fostering",
  },
  {
    slug: "fostering-allowances-pay",
    title: "Fostering Allowances & Pay",
    description: "How foster carer allowances work, what you can expect to receive, and how agencies differ.",
    icon: Home,
    readTime: "7 min read",
    category: "Practical Guide",
  },
  {
    slug: "fostering-assessment-process",
    title: "The Assessment Process",
    description: "What to expect during your fostering assessment, including home visits, training, and panel approval.",
    icon: FileQuestion,
    readTime: "15 min read",
    category: "Getting Started",
  },
  {
    slug: "supporting-foster-children",
    title: "Supporting Foster Children",
    description: "Practical guidance on helping children in your care thrive, including trauma-informed approaches.",
    icon: Heart,
    readTime: "11 min read",
    category: "Foster Care Life",
  },
];

export default function GuidesIndex() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Fostering Guides | How to Become a Foster Carer in England"
        description="Expert guides on becoming a foster carer in England. Learn about the assessment process, choosing an agency, allowances, and supporting children in care."
        canonicalUrl="https://www.foster-care.co.uk/guides"
        structuredData={getBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden gradient-hero">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-warm/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-2 mb-6">
                <BookOpen className="w-4 h-4" />
                Educational Resources
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Fostering Guides
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about becoming a foster carer in England. Expert-written guides to help you on your journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Guide */}
        <section className="py-12 bg-background-warm">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/guides/how-to-become-foster-carer" className="block group">
                <div className="card-elevated p-8 md:p-12 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                      <GraduationCap className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="badge-featured mb-3">
                        <Sparkles className="w-3 h-3" />
                        Featured Guide
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                        How to Become a Foster Carer
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        The complete guide to starting your fostering journey. From your first enquiry to welcoming a child into your home.
                      </p>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          12 min read
                        </span>
                        <span>Getting Started</span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* All Guides */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-center mb-12"
            >
              All Guides
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide, index) => {
                const IconComponent = guide.icon;
                return (
                  <motion.div
                    key={guide.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/guides/${guide.slug}`} className="block group h-full">
                      <div className="card-warm h-full hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {guide.category}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-4 flex-1">
                          {guide.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {guide.readTime}
                          </span>
                          <span className="text-primary font-medium flex items-center gap-1">
                            Read
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="container-main text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Take the Next Step?
              </h2>
              <p className="text-secondary-foreground/80 text-lg mb-8">
                Browse our directory of verified fostering agencies in England and find the right match for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-secondary hover:bg-white/90"
                  asChild
                >
                  <Link href="/agencies">
                    Find Agencies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/specialisms">
                    Explore Specialisms
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>


      <BackToTop />
    </div>
  );
}
