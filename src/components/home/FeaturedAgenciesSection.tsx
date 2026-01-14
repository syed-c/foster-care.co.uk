import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, MapPin, BadgeCheck, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedAgencies } from "@/hooks/useAgencies";
import { Skeleton } from "@/components/ui/skeleton";
import { useCmsContentSection } from "@/hooks/useCmsContent";
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
export function FeaturedAgenciesSection() {
  const {
    data: featuredContent
  } = useCmsContentSection("home", "featured_agencies");
  const {
    data: agencies,
    isLoading
  } = useFeaturedAgencies(6);

  // Fallback data if no agencies in database
  const fallbackAgencies = [{
    id: "1",
    name: "Bright Futures Fostering",
    rating: 4.9,
    review_count: 124,
    city: "London",
    description: "Award-winning agency with 20+ years of experience supporting foster families across London.",
    is_verified: true,
    slug: "bright-futures-fostering"
  }, {
    id: "2",
    name: "Family First Care",
    rating: 4.8,
    review_count: 89,
    city: "Manchester",
    description: "Dedicated to matching children with loving foster carers in the North West region.",
    is_verified: true,
    slug: "family-first-care"
  }, {
    id: "3",
    name: "Compass Fostering Services",
    rating: 4.7,
    review_count: 156,
    city: "Birmingham",
    description: "One of the UK's largest independent fostering agencies with comprehensive support.",
    is_verified: true,
    slug: "compass-fostering"
  }];
  const displayAgencies = agencies && agencies.length > 0 ? agencies.slice(0, 3) : fallbackAgencies;
  const metadata = featuredContent?.metadata as Record<string, string> | null;
  const title = featuredContent?.title || "Trusted by Families";
  const subtitle = metadata?.subtitle || "Featured Agencies";
  const content = featuredContent?.content || "Discover highly-rated foster care agencies recommended by foster carers.";
  const ctaText = metadata?.cta_text || "View All Agencies";
  const ctaUrl = metadata?.cta_url || "/agencies";
  return <section className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.6
      }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-secondary-foreground mb-4 bg-sidebar-primary">
              <Star className="w-4 h-4" />
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {title}
            </h2>
            <p className="text-foreground-muted max-w-xl text-base">
              {content}
            </p>
          </div>
          <Link to={ctaUrl}>
            <Button variant="secondary" size="lg" className="group text-white">
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="h-full bg-[#1a2228] text-white">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>)}
          </div> : <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAgencies.map(agency => <motion.div key={agency.id} variants={cardVariants}>
                <Link to={`/agencies/${agency.slug}`}>
                  <Card className="h-full bg-[#1a2228] text-white group transition-all duration-300 hover:scale-105 hover:shadow-elevated hover:border-primary/20 overflow-hidden relative">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="p-6 relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg text-white group-hover:text-white transition-colors line-clamp-1">
                                {agency.name}
                              </h3>
                              {agency.is_verified && <BadgeCheck className="w-5 h-5 text-white flex-shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-white/60">
                              <MapPin className="w-4 h-4 text-white" />
                              {agency.city || "UK"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/80 text-sm mb-4 line-clamp-2">
                        {agency.description || "Providing exceptional foster care support and services."}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="font-semibold text-sm">{agency.rating?.toFixed(1) || "4.8"}</span>
                          </div>
                          <span className="text-sm text-white/60">
                            ({agency.review_count || 0} reviews)
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>)}
          </motion.div>}
      </div>
    </section>;
}