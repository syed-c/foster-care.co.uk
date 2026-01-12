import { motion } from 'framer-motion';

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
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-muted-foreground text-lg leading-relaxed max-w-[720px] mx-auto"
        >
          {paragraph}
        </motion.p>
      </div>
    </div>
  );
};