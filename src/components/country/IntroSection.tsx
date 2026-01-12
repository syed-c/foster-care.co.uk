import { motion } from 'framer-motion';

interface IntroSectionProps {
  heading?: string;
  paragraphs?: string[];
}

export const IntroSection = ({ heading, paragraphs }: IntroSectionProps) => {
  if (!paragraphs || paragraphs.length === 0) return null;
  
  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-8">
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          >
            {heading}
          </motion.h2>
        )}
        <div className="space-y-4">
          {paragraphs?.slice(0, 1).map((paragraph, index) => (
            <motion.p 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="text-foreground-muted leading-relaxed text-lg max-w-[720px] mx-auto"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
};