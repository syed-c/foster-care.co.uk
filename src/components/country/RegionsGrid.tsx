import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from "lucide-react";
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface RegionsGridProps {
  heading?: string;
  list: string[];
}

export const RegionsGrid = ({ heading, list }: RegionsGridProps) => {
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (!list || list.length === 0) return null;

  const regions = list.map(region => ({
    name: region,
    slug: slugify(region),
    agencies: Math.floor(Math.random() * 50) + 5
  }));

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "Explore Regions in England"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Find foster care agencies in your local area
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {regions.map((region, index) => (
            <motion.div 
              key={region.name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <Link
                to={`/locations/england/${region.slug}`}
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
                  {region.name}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {region.agencies}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};