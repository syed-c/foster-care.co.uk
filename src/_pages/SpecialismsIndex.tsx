"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

import { useSpecialisms } from "@/hooks/useSpecialisms";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart, AlertCircle, Clock, Home, Coffee, Users,
  GraduationCap, Accessibility, Scale, ArrowRight, Sparkles
} from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  AlertCircle,
  Clock,
  Home,
  Coffee,
  Users,
  GraduationCap,
  Accessibility,
  Scale,
};

export default function SpecialismsIndex() {
  const { data: specialisms, isLoading } = useSpecialisms();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Specialisms", url: "/specialisms" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Types of Foster Care | Specialisms & Services | Foster Care UK"
        description="Discover different fostering specialisms in England: emergency, therapeutic, respite, parent & child, sibling groups, teenagers, and more. Find agencies matching your interests and skills."
        canonicalUrl="https://foster-care.co.uk/specialisms"
        keywords={["types of fostering", "foster care specialisms", "therapeutic fostering", "emergency foster care", "respite fostering", "sibling group fostering"]}
        structuredData={getBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden gradient-hero">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-warm/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                Types of Fostering
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Fostering{" "}
                <span className="text-gradient-primary">Specialisms & Types</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                From short-term emergency placements to long-term therapeutic care, explore the different ways you can make
                a difference in a child's life. Each specialism requires unique skills and offers rewarding opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Specialisms Grid */}
        <section className="section-padding bg-background-warm">
          <div className="container-main">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialisms?.map((specialism, index) => {
                  const IconComponent = iconMap[specialism.icon || "Heart"] || Heart;

                  return (
                    <motion.div
                      key={specialism.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link
                        href={`/specialisms/${specialism.slug}`}
                        className="group block h-full"
                      >
                        <div className="card-elevated h-full flex flex-col hover:shadow-float transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                              <IconComponent className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                {specialism.name}
                              </h2>
                            </div>
                          </div>

                          <p className="text-muted-foreground flex-1 mb-4">
                            {specialism.description}
                          </p>

                          <div className="flex items-center gap-2 text-primary font-medium">
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="container-main text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Not Sure Which Type is Right for You?
              </h2>
              <p className="text-secondary-foreground/80 text-lg mb-8">
                Our directory connects you with agencies across England who can guide you through the options and help you find your fostering path.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/agencies"
                  className="btn-primary bg-white text-secondary hover:bg-white/90"
                >
                  Browse All Agencies
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/guides"
                  className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  Read Our Guides
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>


      <BackToTop />
    </div>
  );
}
