import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, Sparkles, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WhyFosteringSectionProps {
  title?: string;
  description?: string;
  locationName?: string;
}

export const WhyFosteringSection = ({ 
  title, 
  description, 
  locationName = "England" 
}: WhyFosteringSectionProps) => {
  const stats = [
    { value: "80,000+", label: "Children in care", icon: Users },
    { value: "9,000+", label: "Need foster homes", icon: Heart },
    { value: "£450+", label: "Weekly allowance", icon: TrendingUp },
  ];

  const benefits = [
    { icon: Shield, title: "Full Training", desc: "Comprehensive preparation" },
    { icon: Heart, title: "24/7 Support", desc: "Always there for you" },
    { icon: Award, title: "Allowances", desc: "Competitive payments" },
    { icon: Users, title: "Community", desc: "Network of carers" },
  ];

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-warm/8 rounded-full blur-[120px]" />
      </div>
      
      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-warm/20 text-warm border-warm/40 mb-4 rounded-full px-3 py-1 font-bold text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Why Foster?
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
              {title || `Why Fostering Matters in ${locationName}`}
            </h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed line-clamp-3">
              {description || `Every child deserves a safe, loving home. Foster carers in ${locationName} make a life-changing difference every day.`}
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-center flex-1 min-w-[90px]"
                >
                  <p className="text-xl md:text-2xl font-black text-white mb-0.5">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {benefits.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/40 hover:border-primary/40 rounded-xl p-4 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-white text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};