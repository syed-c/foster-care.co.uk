import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, MapPin, Star, CheckCircle, Calendar, Eye, ArrowRight, Sparkles, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  city?: string | null;
  description?: string | null;
  rating?: number | null;
  review_count?: number | null;
  is_verified?: boolean | null;
  is_featured?: boolean | null;
  phone?: string | null;
}

interface AgencyListingsProps {
  agencies: Agency[];
  title: string;
  subtitle?: string;
  showFeaturedLabel?: boolean;
  locationName?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const AgencyListings = ({ 
  agencies, 
  title, 
  subtitle,
  showFeaturedLabel = false,
  locationName 
}: AgencyListingsProps) => {
  if (!agencies || agencies.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-900" id="agencies">
      <div className="container-main">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              {showFeaturedLabel && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 rounded-full font-bold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              {title}
            </h2>
            <p className="text-white/50 text-lg">
              {subtitle || `${agencies.length} agencies ready to support your fostering journey`}
            </p>
          </div>
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold"
            asChild
          >
            <Link to="/agencies">
              View All Agencies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Agency List - Horizontal Line Format */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {agencies.map((agency) => (
            <motion.div 
              key={agency.id} 
              variants={itemVariants}
              className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-primary/50 rounded-2xl p-4 md:p-5 transition-all duration-300"
            >
              <div className="flex items-center gap-4 md:gap-6">
                {/* Agency Logo/Image */}
                <div className="flex-shrink-0">
                  {agency.logo_url ? (
                    <img 
                      src={agency.logo_url} 
                      alt={agency.name} 
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border border-slate-600"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center border border-primary/30">
                      <Building2 className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                  )}
                </div>

                {/* Agency Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-primary transition-colors truncate">
                      {agency.name}
                    </h3>
                    {agency.is_verified && (
                      <Badge className="bg-verified/20 text-verified border-verified/40 text-xs rounded-full font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {agency.is_featured && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs rounded-full font-bold">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    {agency.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {agency.city}
                      </span>
                    )}
                    {agency.description && (
                      <span className="hidden lg:block truncate max-w-lg text-white/30">
                        {agency.description.slice(0, 80)}...
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="hidden sm:flex items-center gap-4 px-6 border-l border-slate-700">
                  {agency.rating && agency.rating > 0 ? (
                    <div className="text-center">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-black text-xl text-white">{agency.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-white/40">
                        {agency.review_count || 0} reviews
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-white/40">No reviews yet</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Always Visible */}
                <div className="flex items-center gap-2 md:gap-3">
                  <Button 
                    size="sm" 
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl hidden md:flex"
                    asChild
                  >
                    <a href="#enquire">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      Book
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-4"
                    asChild
                  >
                    <Link to={`/agencies/${agency.slug}`}>
                      <Eye className="w-4 h-4 mr-1.5" />
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button 
            size="lg" 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-8 font-bold"
            asChild
          >
            <Link to="/agencies">
              Explore All Agencies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};