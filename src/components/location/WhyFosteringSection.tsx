import { motion } from "framer-motion";
import { Heart, Shield, Users, Award, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WhyFosteringSectionProps {
  title?: string;
  description?: string;
  locationName?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const WhyFosteringSection = ({ 
  title, 
  description, 
  locationName = "England" 
}: WhyFosteringSectionProps) => {
  const features = [
    { icon: Shield, title: "Verified Agencies", desc: "All agencies thoroughly checked", gradient: "from-verified/30 to-verified/10" },
    { icon: Heart, title: "Child-Focused", desc: "Children's welfare comes first", gradient: "from-warm/30 to-warm/10" },
    { icon: Users, title: "24/7 Support", desc: "Round-the-clock assistance", gradient: "from-trust/30 to-trust/10" },
    { icon: Award, title: "Ofsted Rated", desc: "Quality assured agencies", gradient: "from-amber-500/30 to-amber-500/10" },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-secondary to-secondary/95">
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <Badge className="bg-warm/20 text-warm border-warm/30 mb-4 rounded-full px-4 py-1.5">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            Why Foster?
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {title || `Why Fostering Matters in ${locationName}`}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {description || `Every child deserves a safe, loving home. Foster carers in ${locationName} provide vital support to children who need it most.`}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <div className={`bg-gradient-to-br ${item.gradient} border border-white/10 rounded-2xl p-6 h-full`}>
                <item.icon className="w-7 h-7 text-white/80 mb-4" />
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
