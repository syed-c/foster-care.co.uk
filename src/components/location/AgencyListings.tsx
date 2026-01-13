import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, MapPin, Star, CheckCircle, Calendar, Eye, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AgencyBookingModal } from "./AgencyBookingModal";

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
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const AgencyListings = ({ 
  agencies, 
  title, 
  subtitle,
  showFeaturedLabel = false,
  locationName 
}: AgencyListingsProps) => {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!agencies || agencies.length === 0) return null;

  const handleBookClick = (agency: Agency) => {
    setSelectedAgency(agency);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-10 md:py-14 bg-slate-900" id="agencies">
        <div className="container-main">
          {/* Section Header - Compact */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {title}
                  </h2>
                  {showFeaturedLabel && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 rounded-full font-bold text-[10px] px-2">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-white/40 text-sm">
                  {subtitle || `${agencies.length} agencies ready to help`}
                </p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-bold text-xs"
              asChild
            >
              <Link to="/agencies">
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Agency List - Compact */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-2"
          >
            {agencies.map((agency) => (
              <motion.div 
                key={agency.id} 
                variants={itemVariants}
                className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-primary/40 rounded-xl p-3 md:p-4 transition-all duration-200"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Agency Logo */}
                  <div className="flex-shrink-0">
                    {agency.logo_url ? (
                      <img 
                        src={agency.logo_url} 
                        alt={agency.name} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-slate-600"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center border border-primary/30">
                        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Agency Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors truncate">
                        {agency.name}
                      </h3>
                      {agency.is_verified && (
                        <Badge className="bg-verified/20 text-verified border-verified/40 text-[10px] rounded-full font-bold px-1.5 py-0">
                          <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      {agency.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {agency.city}
                        </span>
                      )}
                      {agency.description && (
                        <span className="hidden lg:block truncate max-w-md text-white/30">
                          {agency.description.slice(0, 60)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="hidden sm:flex items-center gap-3 px-4 border-l border-slate-700/50">
                    {agency.rating && agency.rating > 0 ? (
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-black text-base text-white">{agency.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] text-white/40">
                          {agency.review_count || 0} reviews
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-white/40">New</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs px-3 py-1.5 h-auto hidden md:flex"
                      onClick={() => handleBookClick(agency)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Book
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs px-3 py-1.5 h-auto"
                      asChild
                    >
                      <Link to={`/agencies/${agency.slug}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <Button 
              size="sm" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-6 font-bold text-xs"
              asChild
            >
              <Link to="/agencies">
                See All Agencies
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Agency-specific Booking Modal */}
      <AgencyBookingModal
        agency={selectedAgency}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAgency(null);
        }}
      />
    </>
  );
};
