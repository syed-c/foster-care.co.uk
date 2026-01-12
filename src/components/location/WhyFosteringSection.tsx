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
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-warm/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>
      
      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-warm/20 text-warm border-warm/40 mb-5 rounded-full px-4 py-1.5 font-bold">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Why Foster?
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
              {title || `Why Fostering Matters in ${locationName}`}
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              {description || `Every child deserves a safe, loving home. Foster carers in ${locationName} provide vital support to children who need it most, making a life-changing difference every day.`}
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-center flex-1 min-w-[120px]"
                >
                  <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Benefits Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {benefits.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-primary/40 rounded-3xl p-6 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};