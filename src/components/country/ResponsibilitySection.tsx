import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface ResponsibilitySectionProps {
  heading?: string;
  paragraph?: string;
}

export const ResponsibilitySection = ({ 
  heading, 
  paragraph 
}: ResponsibilitySectionProps) => {
  if (!paragraph) return null;
  
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <motion.div 
            className="bg-muted/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border/40"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                {heading && (
                  <h3 className="font-semibold mb-2 text-foreground">{heading}</h3>
                )}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};