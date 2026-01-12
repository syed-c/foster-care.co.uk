import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  heading?: string;
  questions: FAQItem[];
}

export const FAQAccordion = ({ heading, questions }: FAQAccordionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[80vw] mx-auto"
    >
      <Accordion type="single" collapsible className="w-full space-y-4">
        {questions?.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border/40 rounded-2xl hover:border-primary/20 transition-colors">
            <AccordionTrigger className="text-left text-lg font-medium px-6 py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 pt-0 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
};