import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Shield, Phone, ExternalLink, Building2, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgenciesByCountry } from '@/hooks/useAgenciesByCountry';
import { Skeleton } from '@/components/ui/skeleton';

interface CountryAgenciesSectionProps {
  countrySlug: string;
  countryName: string;
  limit?: number;
}

export const CountryAgenciesSection = ({ 
  countrySlug, 
  countryName,
  limit = 6 
}: CountryAgenciesSectionProps) => {
  const { data: agencies, isLoading, error } = useAgenciesByCountry(countrySlug, limit);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background" id="agencies">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-6"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Fostering Agencies in {countryName}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Browse verified fostering agencies serving families across {countryName}
            </p>
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border/40">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load agencies. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && agencies?.length === 0 && (
          <motion.div 
            className="text-center py-12 sm:py-16 bg-card rounded-2xl border border-border/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Agencies Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're still adding agencies for this region. Check back soon or browse all agencies.
            </p>
            <Link to="/agencies">
              <Button>
                Browse All Agencies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Agencies Grid */}
        {!isLoading && agencies && agencies.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {agencies.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group"
                >
                  <Link to={`/agencies/${agency.slug}`}>
                    <div className="h-full bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        {/* Logo */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/40 group-hover:border-primary/30 transition-colors">
                          {agency.logo_url ? (
                            <img 
                              src={agency.logo_url} 
                              alt={agency.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary/60" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-base sm:text-lg">
                            {agency.name}
                          </h3>
                          {agency.city && (
                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">{agency.city}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {agency.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                          {agency.description}
                        </p>
                      )}

                      {/* Rating & Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {agency.rating && (
                          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full text-sm font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{agency.rating.toFixed(1)}</span>
                            {agency.review_count && (
                              <span className="text-amber-600/70">({agency.review_count})</span>
                            )}
                          </div>
                        )}
                        {agency.ofsted_rating && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Ofsted: {agency.ofsted_rating}
                          </Badge>
                        )}
                        {agency.is_verified && (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs">
                            Verified
                          </Badge>
                        )}
                        {agency.is_featured && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {agency.phone && (
                            <Phone className="w-4 h-4" />
                          )}
                          {agency.website && (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <motion.div 
              className="text-center mt-10 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to={`/agencies?location=${countrySlug}`}>
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl group">
                  View All Agencies in {countryName}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};