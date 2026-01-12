import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Heart, Shield, Users, GraduationCap, Award, Sparkles } from "lucide-react";

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
    { icon: Clock, title: "Short-Term", slug: "short-term" },
    { icon: Heart, title: "Long-Term", slug: "long-term" },
    { icon: Shield, title: "Emergency", slug: "emergency" },
    { icon: Users, title: "Respite", slug: "respite" },
    { icon: GraduationCap, title: "Parent & Child", slug: "parent-and-child" },
    { icon: Award, title: "Specialist", slug: "specialist" },
  ];

  return (
    <section className="py-14 md:py-20 bg-secondary/95">
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Types of Fostering
          </h2>
          <p className="text-white/60 text-lg">Different ways to make a difference</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {types.map((type) => (
            <motion.div key={type.title} variants={itemVariants}>
              <Link to={`/specialisms/${type.slug}`}>
                <div className="group flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 rounded-full px-6 py-3 transition-all duration-300">
                  <type.icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-white/80 group-hover:text-white">{type.title}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
