import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationCTAProps {
  locationName?: string;
}

export const LocationCTA = ({ locationName = "your area" }: LocationCTAProps) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary/30 via-secondary to-verified/20 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-verified/20 rounded-full blur-[120px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm/20 mb-6">
            <Heart className="w-8 h-8 text-warm" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Transform a Child's Life?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join hundreds of foster carers in {locationName} making a real difference every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-hover shadow-xl shadow-primary/30 rounded-2xl px-8 py-6 text-lg"
              asChild
            >
              <a href="#enquire">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 py-6 text-lg"
              asChild
            >
              <Link to="/guides/how-to-become-foster-carer">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
