import { motion } from 'framer-motion';

interface ChecklistListProps {
  items: string[];
}

export const ChecklistList = ({ items }: ChecklistListProps) => {
  return (
    <div className="space-y-3">
      {items?.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-start gap-3"
        >
          <span className="text-green-600 mt-1">✓</span>
          <span className="text-neutral-600">{item}</span>
        </motion.div>
      ))}
    </div>
  );
};