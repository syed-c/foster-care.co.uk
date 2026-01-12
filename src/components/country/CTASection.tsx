import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface CTASectionProps {
  heading?: string;
  paragraph?: string;
  button_text?: string;
}

export const CTASection = ({ 
  heading, 
  paragraph, 
  button_text 
}: CTASectionProps) => {
  if (!heading && !paragraph) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background" id="contact">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 text-center shadow-2xl shadow-primary/25"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <motion.div 
              className="absolute top-8 right-8 hidden sm:block"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-white/20 fill-white/10" />
            </motion.div>
            <motion.div 
              className="absolute bottom-8 left-8 hidden sm:block"
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className="w-6 h-6 text-white/20" />
            </motion.div>
            
            <div className="relative z-10">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {heading || "Start Exploring Fostering Agencies"}
              </motion.h2>
              <motion.p 
                className="text-white/85 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {paragraph || "Connect with verified agencies that can support your fostering journey"}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/agencies">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-xl h-12 sm:h-14 px-6 sm:px-8 font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {button_text || "Browse Agencies"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white hover:text-black rounded-xl h-12 sm:h-14 px-6 sm:px-8 font-medium transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};