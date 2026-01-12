import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

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
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const ChildLocationsGrid = ({ 
  locations, 
  title, 
  subtitle,
  getLocationUrl 
}: ChildLocationsGridProps) => {
  if (!locations || locations.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-secondary/95">
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-trust/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-trust" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
            {title}
          </h2>
          <p className="text-white/60 text-lg">
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
                <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 rounded-2xl p-4 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm mb-1 truncate">
                    {location.name}
                  </h3>
                  <p className="text-xs text-white/40">
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
