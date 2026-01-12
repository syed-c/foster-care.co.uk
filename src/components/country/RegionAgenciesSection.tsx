import { motion } from 'framer-motion';
import { Building2, Star, MapPin, ArrowRight, BadgeCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAgenciesByRegion, type Agency } from '@/hooks/useAgenciesByRegion';
import { Skeleton } from '@/components/ui/skeleton';

interface RegionAgenciesSectionProps {
  regionSlug: string;
  regionName: string;
  limit?: number;
}

export const RegionAgenciesSection = ({ regionSlug, regionName, limit = 6 }: RegionAgenciesSectionProps) => {
  const { data: agencies, isLoading, error } = useAgenciesByRegion(regionSlug, limit);

  if (error) {
    console.error('Error loading agencies:', error);
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background" id="agencies">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-6"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Foster Care Agencies in {regionName}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Discover verified fostering agencies operating in {regionName} and find the right match for your family
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/40 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && agencies?.length === 0 && (
          <motion.div 
            className="text-center py-12 px-6 bg-card rounded-2xl border border-border/40"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No agencies found</h3>
            <p className="text-muted-foreground mb-6">
              We're still expanding our directory in {regionName}. Check back soon or browse all agencies.
            </p>
            <Link to="/agencies">
              <Button>Browse All Agencies</Button>
            </Link>
          </motion.div>
        )}

        {/* Agency Cards Grid */}
        {!isLoading && agencies && agencies.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency, index) => (
                <motion.div
                  key={agency.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group bg-card rounded-2xl border border-border/40 p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border border-border/30 flex-shrink-0">
                      {agency.logo_url ? (
                        <img 
                          src={agency.logo_url} 
                          alt={agency.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-primary/60" />
                      )}
                    </div>
                    
                    {/* Name & Verified Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {agency.name}
                        </h3>
                        {agency.is_verified && (
                          <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Location */}
                      {agency.city && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{agency.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  {agency.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-foreground">{Number(agency.rating).toFixed(1)}</span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {agency.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {agency.description}
                    </p>
                  )}

                  {/* View Profile Button */}
                  <Link to={`/agencies/${agency.slug}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                    >
                      View Profile
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </Button>
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
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/agencies">
                <Button size="lg" className="h-12 sm:h-14 px-8 rounded-xl group">
                  View All Agencies
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
