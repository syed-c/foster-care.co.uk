import { motion } from 'framer-motion';

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
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "How to Become a Foster Carer"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground-muted text-lg max-w-[720px] mx-auto"
        >
          {note || "Follow these steps to start your fostering journey"}
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative max-w-[1200px] mx-auto"
      >
        {/* Connecting line */}
        <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-primary/30 hidden lg:block"></div>
        
        <div className="space-y-12 lg:space-y-0">
          {steps?.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative flex items-start gap-6 lg:gap-12"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold z-10">
                {index + 1}
              </div>
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/40 backdrop-blur-sm flex-1">
                <h3 className="text-xl font-semibold mb-3">{step.name}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};