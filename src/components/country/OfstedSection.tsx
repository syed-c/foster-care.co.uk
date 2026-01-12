import { motion } from 'framer-motion';
import { Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface OfstedSectionProps {
  heading?: string;
  description?: string;
}

export const OfstedSection = ({ heading, description }: OfstedSectionProps) => {
  if (!heading && !description) return null;
  
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
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-800/50 rounded-2xl p-8 md:p-10 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    {heading}
                  </h2>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                
                {description && (
                  <p className="text-white/60 text-lg leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
