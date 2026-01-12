import { motion } from 'framer-motion';

interface DefinitionItem {
  term: string;
  definition: string;
}

interface DefinitionListProps {
  items: DefinitionItem[];
}

export const DefinitionList = ({ items }: DefinitionListProps) => {
  return (
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-card rounded-2xl p-6 border border-border/40 hover:border-primary/20 transition-colors"
        >
          <dt className="font-semibold text-foreground mb-2">{item.term}</dt>
          <dd className="text-muted-foreground">{item.definition}</dd>
        </motion.div>
      ))}
    </dl>
  );
};