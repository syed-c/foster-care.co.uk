import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface OfstedSectionProps {
  heading?: string;
  description?: string;
}

export const OfstedSection = ({ heading, description }: OfstedSectionProps) => {
  if (!heading && !description) return null;
  
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <motion.div 
            className="bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <motion.div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {heading}
                  </h2>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                
                {description && (
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};