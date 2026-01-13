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
    <section className="py-10 md:py-14 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-trust/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust/30 to-trust/10 flex items-center justify-center border border-trust/30">
              <MapPin className="w-5 h-5 text-trust" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {title}
              </h2>
              <p className="text-white/40 text-sm">
                {locations.length} areas to explore
              </p>
            </div>
          </div>
          <Badge className="bg-trust/20 text-trust border-trust/40 rounded-full font-bold text-xs px-2">
            {locations.length} Areas
          </Badge>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2"
        >
          {locations.map((location) => (
            <motion.div key={location.id} variants={itemVariants}>
              <Link to={getLocationUrl(location)}>
                <div className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-trust/40 rounded-xl p-3 transition-all duration-200 h-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <MapPin className="w-3 h-3 text-trust" />
                    <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-trust transition-colors" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-trust transition-colors text-xs mb-0.5 truncate">
                    {location.name}
                  </h3>
                  <p className="text-[10px] text-white/40 flex items-center gap-0.5">
                    <Building2 className="w-2.5 h-2.5" />
                    {location.agency_count || 0}
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