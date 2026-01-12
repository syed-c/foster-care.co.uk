import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

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
    <section className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/60 rounded-2xl p-6 md:p-8 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                {heading && (
                  <h3 className="font-bold mb-2 text-white">{heading}</h3>
                )}
                <p className="text-white/60 text-sm leading-relaxed">
                  {paragraph}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
