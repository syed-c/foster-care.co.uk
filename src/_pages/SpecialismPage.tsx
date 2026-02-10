"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";

import { useSpecialismBySlug, useAgenciesBySpecialism } from "@/hooks/useSpecialisms";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Heart, AlertCircle, Clock, Home, Coffee, Users,
  GraduationCap, Accessibility, Scale, ArrowRight, ArrowLeft,
  Sparkles, MapPin, Star, BadgeCheck, CheckCircle
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

export default function SpecialismPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: specialism, isLoading: loadingSpecialism } = useSpecialismBySlug(slug);
  const { data: agencies, isLoading: loadingAgencies } = useAgenciesBySpecialism(specialism?.id);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Specialisms", url: "/specialisms" },
    { name: specialism?.name || "Loading...", url: `/specialisms/${slug}` },
  ];

  if (loadingSpecialism) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-28">
          <div className="container-main">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-xl mb-8" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </main>

      </div>
    );
  }

  if (!specialism) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-28 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Specialism Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The fostering specialism you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/specialisms">View All Specialisms</Link>
            </Button>
          </div>
        </main>

      </div>
    );
  }

  const IconComponent = iconMap[specialism.icon || "Heart"] || Heart;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={specialism.seo_title || `${specialism.name} | Fostering Agencies in England`}
        description={specialism.seo_description || specialism.description || ""}
        canonicalUrl={`https://fostercare.uk/specialisms/${slug}`}
        structuredData={getBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden gradient-hero">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-warm/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10">
            <Link
              href="/specialisms"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Specialisms
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1 mb-2">
                    <Sparkles className="w-3 h-3" />
                    Fostering Specialism
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
                    {specialism.name}
                  </h1>
                </div>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {specialism.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full"
                  onClick={() => document.getElementById("agencies")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Find Agencies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                  asChild
                >
                  <Link href="/contact">Get Advice</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="section-padding bg-background-warm">
          <div className="container-main">
            <div className="grid lg:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                  What is {specialism.name}?
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    {specialism.description}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="card-elevated sticky top-24">
                  <h3 className="font-display text-lg font-semibold mb-4">
                    Key Information
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                      <span className="text-foreground">Specialist training provided</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                      <span className="text-foreground">Enhanced support packages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                      <span className="text-foreground">24/7 agency support available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                      <span className="text-foreground">Competitive allowances</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Agencies Section */}
        <section id="agencies" className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Agencies Offering {specialism.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with verified agencies across England that specialise in {specialism.name.toLowerCase()}.
              </p>
            </motion.div>

            {loadingAgencies ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-3xl" />
                ))}
              </div>
            ) : agencies && agencies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agencies.map((agency: any, index: number) => (
                  <motion.div
                    key={agency.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/agencies/${agency.slug}`} className="block group">
                      <div className="agency-card p-6 h-full">
                        <div className="flex items-start gap-4 mb-4">
                          {agency.logo_url ? (
                            <img
                              src={agency.logo_url}
                              alt={agency.name}
                              className="w-14 h-14 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <Home className="w-7 h-7 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {agency.name}
                            </h3>
                            {agency.city && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {agency.city}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {agency.is_verified && (
                            <Badge className="badge-verified">
                              <BadgeCheck className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                          {agency.rating && (
                            <Badge variant="secondary" className="rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              {Number(agency.rating).toFixed(1)}
                            </Badge>
                          )}
                        </div>

                        {agency.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {agency.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No agencies listed yet</h3>
                <p className="text-muted-foreground mb-6">
                  We're working on adding agencies that offer {specialism.name.toLowerCase()}.
                </p>
                <Button asChild>
                  <Link href="/agencies">Browse All Agencies</Link>
                </Button>
              </div>
            )}

            {agencies && agencies.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="rounded-full" asChild>
                  <Link href={`/agencies?specialism=${specialism.slug}`}>
                    View All Agencies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Related Specialisms */}
        <section className="section-padding bg-background-sand">
          <div className="container-main">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              Explore Other Fostering Types
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/specialisms/therapeutic-fostering" className="badge-pill hover:bg-primary/10 hover:text-primary transition-colors">
                Therapeutic Fostering
              </Link>
              <Link href="/specialisms/emergency-fostering" className="badge-pill hover:bg-primary/10 hover:text-primary transition-colors">
                Emergency Fostering
              </Link>
              <Link href="/specialisms/respite-fostering" className="badge-pill hover:bg-primary/10 hover:text-primary transition-colors">
                Respite Fostering
              </Link>
              <Link href="/specialisms/parent-child-fostering" className="badge-pill hover:bg-primary/10 hover:text-primary transition-colors">
                Parent & Child
              </Link>
              <Link href="/specialisms/teen-fostering" className="badge-pill hover:bg-primary/10 hover:text-primary transition-colors">
                Teen Fostering
              </Link>
            </div>
          </div>
        </section>
      </main>


      <BackToTop />
    </div>
  );
}
