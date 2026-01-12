import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface Step {
  name: string;
  description: string;
}

interface HowToBecomeSectionProps {
  heading?: string;
  note?: string;
  steps?: Step[];
}

export const HowToBecomeSection = ({ 
  heading, 
  note, 
  steps 
}: HowToBecomeSectionProps) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "How to Become a Foster Carer"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {note || "Follow these steps to start your fostering journey"}
            </p>
          </div>
        </ScrollReveal>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10 hidden md:block" />
          
          <div className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-4 sm:gap-6 md:gap-8"
              >
                <motion.div 
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-lg sm:text-xl z-10 shadow-lg shadow-primary/10"
                  whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary))", color: "white" }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.div>
                <motion.div 
                  className="flex-1 bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{step.name}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};