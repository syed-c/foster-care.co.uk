"use client";
import Link from "next/link";
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <section className="py-16 md:py-20 bg-slate-950 relative overflow-hidden" id="contact">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-trust/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl shadow-primary/25"
        >
          {/* Inner decorative elements */}
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white tracking-tight">
              {heading || "Start Exploring Fostering Agencies"}
            </h2>
            <p className="text-white/85 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {paragraph || "Connect with verified agencies that can support your fostering journey"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/agencies">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-xl h-12 sm:h-14 px-6 sm:px-8 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {button_text || "Browse Agencies"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary rounded-xl h-12 sm:h-14 px-6 sm:px-8 font-bold transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
