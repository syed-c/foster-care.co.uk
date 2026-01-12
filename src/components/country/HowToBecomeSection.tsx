import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { ListChecks } from 'lucide-react';

interface Step {
  name: string;
  description: string;
}

interface HowToBecomeSectionProps {
  heading?: string;
  note?: string;
  steps?: Step[];
}

export const HowToBecomeSection = ({ 
  heading, 
  note, 
  steps 
}: HowToBecomeSectionProps) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-trust/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-trust/20 text-trust border-trust/40 rounded-full px-4 py-1.5 font-bold mb-4">
            <ListChecks className="w-3.5 h-3.5 mr-1.5" />
            Step by Step
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "How to Become a Foster Carer"}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {note || "Follow these steps to start your fostering journey"}
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 via-trust/30 to-verified/20 hidden md:block" />
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-4 md:gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-black text-lg z-10 shadow-lg shadow-primary/30">
                  {index + 1}
                </div>
                <div className="flex-1 bg-slate-800/60 hover:bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-700/50 hover:border-primary/30 transition-all duration-300">
                  <h3 className="text-lg font-bold mb-2 text-white">{step.name}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
