"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationCTAProps {
  locationName?: string;
}

export const LocationCTA = ({ locationName = "your area" }: LocationCTAProps) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/30 via-slate-900 to-verified/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-verified/20 rounded-full blur-[150px]" />
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-warm/30 border border-warm/40 flex items-center justify-center">
            <Heart className="w-7 h-7 text-warm" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-[12%] hidden lg:block"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/30 border border-amber-500/40 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-24 right-[20%] hidden xl:block"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-10 h-10 text-primary/50" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-[15%] hidden xl:block"
          animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-verified/30 border border-verified/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-verified" />
          </div>
        </motion.div>
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-warm/30 to-warm/10 border border-warm/40 mb-8 shadow-xl shadow-warm/20"
          >
            <Heart className="w-10 h-10 text-warm" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
            Ready to Transform a Child's Life?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of foster carers in {locationName} making a real difference every day. Your journey starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-hover text-white font-bold shadow-xl shadow-primary/30 rounded-2xl px-8 py-6 text-lg"
              asChild
            >
              <a href="#enquire">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button 
              size="lg" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl px-8 py-6 text-lg"
              asChild
            >
              <Link href="/guides/how-to-become-foster-carer">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};