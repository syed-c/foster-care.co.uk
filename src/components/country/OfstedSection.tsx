import { motion } from 'framer-motion';

interface OfstedSectionProps {
  heading?: string;
  description?: string;
}

export const OfstedSection = ({ heading, description }: OfstedSectionProps) => {
  if (!heading && !description) return null;
  
  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground flex items-center justify-center gap-3"
        >
          {heading}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 text-sm font-bold">
            ✓
          </span>
        </motion.h2>
        
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-foreground-muted text-lg leading-relaxed max-w-[720px] mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
};