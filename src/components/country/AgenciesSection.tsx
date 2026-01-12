import { motion } from 'framer-motion';

interface AgenciesSectionProps {
  title?: string;
  id?: string;
}

export const AgenciesSection = ({ title, id }: AgenciesSectionProps) => {
  return (
    <div className="w-full" id={id || "agencies"}>
      <div className="text-center max-w-[720px] mx-auto mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
        >
          {title || 'Find Agencies'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground-muted leading-relaxed text-lg max-w-[720px] mx-auto"
        >
          This section would display agencies related to this region.
        </motion.p>
      </div>
    </div>
  );
};