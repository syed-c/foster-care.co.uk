import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Heart, Shield, Users, GraduationCap, Award, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const FosteringTypesSection = () => {
  const types = [
    { icon: Clock, title: "Short-Term", slug: "short-term", desc: "Temporary placements", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
    { icon: Heart, title: "Long-Term", slug: "long-term", desc: "Permanent care", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30" },
    { icon: Shield, title: "Emergency", slug: "emergency", desc: "Urgent support", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30" },
    { icon: Users, title: "Respite", slug: "respite", desc: "Short breaks", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30" },
    { icon: GraduationCap, title: "Parent & Child", slug: "parent-and-child", desc: "Family placements", color: "from-violet-500/20 to-violet-600/10 border-violet-500/30" },
    { icon: Award, title: "Specialist", slug: "specialist", desc: "Complex needs", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" },
  ];

  return (
    <section className="py-14 md:py-20 bg-slate-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge className="bg-primary/20 text-primary border-primary/40 mb-4 rounded-full px-4 py-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Explore Options
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Types of Fostering
          </h2>
          <p className="text-white/50 text-lg">Find the right fostering path for you</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {types.map((type) => (
            <motion.div key={type.title} variants={itemVariants}>
              <Link to={`/specialisms/${type.slug}`}>
                <div className={`group bg-gradient-to-br ${type.color} hover:scale-105 border rounded-2xl p-5 transition-all duration-300 h-full text-center`}>
                  <type.icon className="w-8 h-8 text-white/70 mx-auto mb-3" />
                  <h3 className="font-bold text-white text-base mb-1">{type.title}</h3>
                  <p className="text-xs text-white/40">{type.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link 
            to="/specialisms" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold transition-colors"
          >
            View all specialisms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};