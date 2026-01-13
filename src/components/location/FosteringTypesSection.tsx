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

interface FosteringTypesSectionProps {
  currentLocationPath?: string;
  locationName?: string;
}

export const FosteringTypesSection = ({ currentLocationPath, locationName }: FosteringTypesSectionProps) => {
  const types = [
    { icon: Clock, title: "Short-Term", slug: "short-term-fostering", desc: "Temporary placements", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
    { icon: Heart, title: "Long-Term", slug: "long-term-fostering", desc: "Permanent care", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30" },
    { icon: Shield, title: "Emergency", slug: "emergency-fostering", desc: "Urgent support", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30" },
    { icon: Users, title: "Respite", slug: "respite-fostering", desc: "Short breaks", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30" },
    { icon: GraduationCap, title: "Parent & Child", slug: "parent-child-fostering", desc: "Family placements", color: "from-violet-500/20 to-violet-600/10 border-violet-500/30" },
    { icon: Award, title: "Therapeutic", slug: "therapeutic-fostering", desc: "Complex needs", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" },
  ];

  const getTypeUrl = (slug: string) => {
    if (currentLocationPath) {
      return `${currentLocationPath}/${slug}`;
    }
    return `/specialisms/${slug}`;
  };

  return (
    <section className="py-10 md:py-14 bg-slate-950 relative overflow-hidden">
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <Badge className="bg-primary/20 text-primary border-primary/40 mb-3 rounded-full px-3 py-1 font-bold text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Options
          </Badge>
          <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">
            Types of Fostering{locationName ? ` in ${locationName}` : ''}
          </h2>
          <p className="text-white/40 text-sm">Find the right path for you</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2"
        >
          {types.map((type) => (
            <motion.div key={type.title} variants={itemVariants}>
              <Link to={getTypeUrl(type.slug)}>
                <div className={`group bg-gradient-to-br ${type.color} hover:scale-105 border rounded-xl p-3 transition-all duration-200 h-full text-center`}>
                  <type.icon className="w-6 h-6 text-white/70 mx-auto mb-2" />
                  <h3 className="font-bold text-white text-xs mb-0.5">{type.title}</h3>
                  <p className="text-[10px] text-white/40">{type.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-5"
        >
          <Link 
            to="/specialisms" 
            className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-bold text-sm transition-colors"
          >
            View all specialisms
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};