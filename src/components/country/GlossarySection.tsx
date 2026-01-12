import { motion } from 'framer-motion';

interface GlossaryItem {
  term: string;
  definition: string;
}

interface GlossarySectionProps {
  heading?: string;
  items?: GlossaryItem[];
}

export const GlossarySection = ({ 
  heading, 
  items 
}: GlossarySectionProps) => {
  if (!items || Object.keys(items).length === 0) return null;

  // Convert object to array format if needed
  const itemsArray = Array.isArray(items) ? items : Object.entries(items).map(([term, definition]) => ({ term, definition }));

  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "Fostering Terms & Definitions"}
        </motion.h2>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1200px] mx-auto"
      >
        {itemsArray?.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-card rounded-xl p-4 border border-border/40"
          >
            <h3 className="font-semibold mb-2 text-primary text-sm">{item.term}</h3>
            <p className="text-muted-foreground text-xs">{item.definition}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};