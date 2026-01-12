import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Globe } from "lucide-react";

interface RegionsGridProps {
  heading?: string;
  list: string[];
}

export const RegionsGrid = ({ heading, list }: RegionsGridProps) => {
  // Function to slugify region names for URL
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  if (!list || list.length === 0) return null;

  // Convert list to region objects
  const regions = list.map(region => ({
    name: region,
    slug: slugify(region),
    agencies: Math.floor(Math.random() * 50) + 5 // Random agency count for demo
  }));

  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "Explore Regions in England"}
        </motion.h2>
      </div>

      {/* Regions Grid - using modern icon pills */}
      <div className="flex flex-wrap justify-center gap-4 max-w-[1200px] mx-auto">
        {regions.map((region, index) => (
          <motion.div 
            key={region.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={`/locations/england/${region.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 group"
            >
              <MapPin className="w-4 h-4 text-primary group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary transition-colors">{region.name}</span>
              <span className="text-sm text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                {region.agencies}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};