import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface GlossaryItem {
  term: string;
  definition: string;
}

interface GlossarySectionProps {
  heading?: string;
  items?: GlossaryItem[] | Record<string, string>;
}

export const GlossarySection = ({ 
  heading, 
  items 
}: GlossarySectionProps) => {
  if (!items || (Array.isArray(items) ? items.length === 0 : Object.keys(items).length === 0)) return null;

  const itemsArray: GlossaryItem[] = Array.isArray(items) 
    ? items 
    : Object.entries(items).map(([term, definition]) => ({ term, definition: String(definition) }));

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-6"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "Fostering Terms & Definitions"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Understanding key terminology in foster care
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {itemsArray.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group"
            >
              <div className="h-full bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                <h3 className="font-semibold mb-2 text-primary text-sm sm:text-base group-hover:text-primary/80 transition-colors">
                  {item.term}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.definition}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};