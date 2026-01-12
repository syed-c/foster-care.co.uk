import { motion } from 'framer-motion';

interface IntroSectionProps {
  heading?: string;
  paragraphs?: string[];
}

export const IntroSection = ({
  heading,
  paragraphs
}: IntroSectionProps) => {
  if (!paragraphs || paragraphs.length === 0) return null;
  
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-trust/5 rounded-full blur-[100px] -translate-y-1/2" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          {heading && (
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white tracking-tight">
              {heading}
            </h2>
          )}
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-white/70 leading-relaxed text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
