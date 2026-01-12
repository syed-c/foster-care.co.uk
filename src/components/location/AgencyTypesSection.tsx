import { motion } from "framer-motion";
import { Building2, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const AgencyTypesCompactSection = () => {
  return (
    <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }} />
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge className="bg-verified/20 text-verified border-verified/40 mb-4 rounded-full px-4 py-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Compare Options
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Agency Types Explained
          </h2>
          <p className="text-white/50 text-lg">Choose the right type for your needs</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-black text-xl text-white">Independent Agencies</h3>
              </div>
              <ul className="space-y-3 text-sm mb-5">
                {["24/7 dedicated support line", "Specialist training programmes", "Competitive weekly allowances", "Smaller caseloads"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/guides/how-to-become-foster-carer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm transition-colors"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-trust/20 via-trust/10 to-transparent border border-trust/30 rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-trust/20 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-trust/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-trust" />
                </div>
                <h3 className="font-black text-xl text-white">Local Authority</h3>
              </div>
              <ul className="space-y-3 text-sm mb-5">
                {["Local placements priority", "Council support network", "Strong community ties", "Established processes"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <CheckCircle className="w-4 h-4 text-trust flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/guides/how-to-become-foster-carer"
                className="inline-flex items-center gap-2 text-trust hover:text-trust/80 font-bold text-sm transition-colors"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};