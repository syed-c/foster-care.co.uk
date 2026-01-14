import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, MapPin, Star, Eye, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  city?: string | null;
  short_description?: string | null;
  description?: string | null;
  rating?: number | null;
  review_count?: number | null;
  is_verified?: boolean | null;
  is_featured?: boolean | null;
  claim_status?: string | null;
  agency_type?: string | null;
}

interface AgencyRowListingProps {
  agencies: Agency[];
  title: string;
  subtitle?: string;
  locationName?: string;
  showViewAll?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const getAgencyTypeLabel = (type: string | null | undefined) => {
  switch (type) {
    case 'ifa': return 'Independent';
    case 'local_authority': return 'Local Authority';
    case 'charity': return 'Charity';
    default: return null;
  }
};

export function AgencyRowListing({ 
  agencies, 
  title, 
  subtitle,
  locationName,
  showViewAll = true
}: AgencyRowListingProps) {
  const agencyCount = agencies?.length || 0;

  // Sort: verified first, then by rating
  const sortedAgencies = [...(agencies || [])].sort((a, b) => {
    if (a.is_verified && !b.is_verified) return -1;
    if (!a.is_verified && b.is_verified) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <section className="py-10 md:py-14 bg-background" id="agencies">
      <div className="container-main">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  {title}
                </h2>
                <Badge className="bg-muted text-muted-foreground border-border rounded-full font-semibold text-xs px-2.5">
                  {agencyCount} {agencyCount === 1 ? 'agency' : 'agencies'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {subtitle || `Compare and connect with agencies in ${locationName || 'this area'}`}
              </p>
            </div>
          </div>
          {showViewAll && (
            <Button 
              variant="outline"
              size="sm"
              className="rounded-full font-semibold text-xs"
              asChild
            >
              <Link to="/agencies">
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Agency List - Compact Row Format */}
        {agencyCount > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-2"
          >
            {sortedAgencies.map((agency) => (
              <motion.div 
                key={agency.id} 
                variants={itemVariants}
                className="group bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-2xl p-3 md:p-4 transition-all duration-200 shadow-soft hover:shadow-card"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Agency Logo - Left */}
                  <div className="flex-shrink-0">
                    {agency.logo_url ? (
                      <img 
                        src={agency.logo_url} 
                        alt={agency.name} 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Agency Info - Middle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors truncate">
                        {agency.name}
                      </h3>
                      {agency.is_featured && (
                        <Badge className="bg-warm/15 text-warm border-warm/25 text-[10px] rounded-full font-bold px-2 py-0">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      {agency.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {agency.city}
                        </span>
                      )}
                      {getAgencyTypeLabel(agency.agency_type) && (
                        <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium">
                          {getAgencyTypeLabel(agency.agency_type)}
                        </span>
                      )}
                      <span className="hidden md:block truncate max-w-xs text-muted-foreground/70">
                        {agency.short_description || agency.description?.slice(0, 60)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="hidden sm:flex items-center">
                    {agency.is_verified ? (
                      <StatusBadge variant="verified">Verified</StatusBadge>
                    ) : (
                      <StatusBadge variant="unclaimed">Unclaimed</StatusBadge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="hidden md:flex items-center gap-2 px-3 border-l border-border">
                    {agency.rating && agency.rating > 0 ? (
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-sm text-foreground">{agency.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {agency.review_count || 0} reviews
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">New listing</span>
                    )}
                  </div>

                  {/* CTA - Right */}
                  <Button 
                    size="sm" 
                    className="rounded-full font-semibold text-xs px-4 py-2 h-auto"
                    asChild
                  >
                    <Link to={`/agencies/${agency.slug}`}>
                      <Eye className="w-3 h-3 mr-1.5" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl p-8 text-center shadow-soft"
          >
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No agencies listed yet</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
              We're actively adding fostering agencies in {locationName || 'this area'}. 
              Check back soon or browse agencies in nearby regions.
            </p>
            <Button 
              className="rounded-full font-semibold"
              asChild
            >
              <Link to="/agencies">Browse All Agencies</Link>
            </Button>
          </motion.div>
        )}

        {/* View More */}
        {agencyCount > 0 && showViewAll && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <Button 
              variant="outline"
              className="rounded-full px-6 font-semibold text-sm"
              asChild
            >
              <Link to="/agencies">
                See All Agencies in England
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
