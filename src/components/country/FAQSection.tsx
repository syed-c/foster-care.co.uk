import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  heading?: string;
  questions?: FAQItem[];
}

export const FAQSection = ({ 
  heading, 
  questions 
}: FAQSectionProps) => {
  if (!questions || questions.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-trust/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/20 text-primary border-primary/40 rounded-full px-4 py-1.5 font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
            FAQs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "Frequently Asked Questions"}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Find answers to common questions about fostering
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {questions.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem 
                  value={`faq-${index}`}
                  className="bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-slate-600 px-5 transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-bold hover:no-underline py-4 text-white text-sm sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 pb-4 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
