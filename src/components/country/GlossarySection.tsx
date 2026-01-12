import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface GlossaryItem {
  term: string;
  definition: string;
}

interface GlossarySectionProps {
  heading?: string;
  items?: GlossaryItem[] | Record<string, string>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const GlossarySection = ({ 
  heading, 
  items 
}: GlossarySectionProps) => {
  if (!items || (Array.isArray(items) ? items.length === 0 : Object.keys(items).length === 0)) return null;

  const itemsArray: GlossaryItem[] = Array.isArray(items) 
    ? items 
    : Object.entries(items).map(([term, definition]) => ({ term, definition: String(definition) }));

  return (
    <section className="py-16 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/20 text-primary border-primary/40 rounded-full px-4 py-1.5 font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Glossary
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "Fostering Terms & Definitions"}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Understanding key terminology in foster care
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {itemsArray.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full bg-slate-800/60 hover:bg-slate-800 rounded-xl p-4 border border-slate-700/50 hover:border-primary/30 transition-all duration-300">
                <h3 className="font-bold mb-2 text-primary text-sm group-hover:text-primary/80 transition-colors">
                  {item.term}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.definition}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
