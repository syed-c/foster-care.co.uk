import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTA {
  heading?: string;
  paragraph?: string;
  button_text?: string;
  button_url?: string;
}

interface HeroSectionProps {
  title?: string;
  paragraphs: string[];
  cta?: CTA;
}

export const HeroSection = ({ title, paragraphs, cta }: HeroSectionProps) => {
  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {title || "Fostering Agencies in England"}
        </motion.h1>
        
        <div className="space-y-3 mb-8">
          {paragraphs.slice(0, 2).map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="text-foreground-muted text-lg leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={cta?.button_url || "/agencies"}>
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              {cta?.button_text || "Browse Agencies"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/locations/england">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Find My Region
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Stats Row - identical to homepage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1200px] mx-auto mt-10"
      >
        {[
          { value: "500+", label: "Verified Agencies" },
          { value: "4 Nations", label: "Across the UK" },
          { value: "Trusted", label: "By Social Workers" },
          { value: "70K+", label: "Children Need Care" }
        ].map((stat, index) => (
          <div key={index} className="text-center p-4">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};