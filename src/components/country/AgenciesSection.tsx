import { motion } from 'framer-motion';
import { Search, MapPin, Building2 } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AgenciesSectionProps {
  title?: string;
  id?: string;
}

export const AgenciesSection = ({ title, id }: AgenciesSectionProps) => {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background" id={id || "agencies"}>
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-12">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-6"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {title || 'Find Fostering Agencies'}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Browse verified fostering agencies in your area and find the perfect match for your family
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/agencies">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl group">
                  <Search className="w-4 h-4 mr-2" />
                  Browse All Agencies
                </Button>
              </Link>
              <Link to="/locations">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl group">
                  <MapPin className="w-4 h-4 mr-2" />
                  Search by Location
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { value: "500+", label: "Agencies" },
            { value: "100%", label: "Verified" },
            { value: "24h", label: "Response" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/40 shadow-sm"
              whileHover={{ y: -4 }}
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};