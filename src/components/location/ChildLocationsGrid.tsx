import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: string;
  name: string;
  slug: string;
  agency_count?: number | null;
}

interface ChildLocationsGridProps {
  locations: Location[];
  title: string;
  subtitle?: string;
  getLocationUrl: (location: Location) => string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const ChildLocationsGrid = ({ 
  locations, 
  title, 
  subtitle,
  getLocationUrl 
}: ChildLocationsGridProps) => {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-trust/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-verified/8 rounded-full blur-[120px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-trust/30 to-trust/10 flex items-center justify-center border border-trust/30">
              <MapPin className="w-6 h-6 text-trust" />
            </div>
            <Badge className="bg-trust/20 text-trust border-trust/40 rounded-full font-bold">
              {locations.length} Areas
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            {title}
          </h2>
          <p className="text-white/50 text-lg">
            {subtitle || "Explore fostering agencies in specific areas"}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {locations.map((location) => (
            <motion.div key={location.id} variants={itemVariants}>
              <Link to={getLocationUrl(location)}>
                <div className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-trust/50 rounded-2xl p-4 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-4 h-4 text-trust" />
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-trust transition-colors" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-trust transition-colors text-sm mb-1 truncate">
                    {location.name}
                  </h3>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {location.agency_count || 0} agencies
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};