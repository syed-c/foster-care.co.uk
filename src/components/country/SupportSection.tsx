import { motion } from 'framer-motion';

interface Category {
  name: string;
  description: string;
}

interface SupportSectionProps {
  heading?: string;
  categories?: Category[];
}

export const SupportSection = ({ 
  heading, 
  categories 
}: SupportSectionProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "Support for Foster Carers"}
        </motion.h2>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto"
      >
        {categories?.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative card-warm group-hover:border-primary/20 transition-all duration-300 h-full p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};