import { motion } from 'framer-motion';
import { Shield, Heart, Users, CheckCircle, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface WhyFosteringMattersSectionProps {
  heading?: string;
  paragraphs?: string[];
}

export const WhyFosteringMattersSection = ({ heading, paragraphs }: WhyFosteringMattersSectionProps) => {
  if (!paragraphs || paragraphs.length === 0) return null;

  const trustPoints = [
    {
      icon: Shield,
      title: "Verified Agencies",
      description: "All agencies are checked and verified to ensure quality care standards.",
      color: "from-emerald-500/20 to-emerald-600/5",
      iconColor: "text-emerald-400"
    },
    {
      icon: Heart,
      title: "Child-Focused",
      description: "Every connection we facilitate puts the welfare of children first.",
      color: "from-rose-500/20 to-rose-600/5",
      iconColor: "text-rose-400"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Experienced professionals guiding you through your fostering journey.",
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400"
    },
    {
      icon: CheckCircle,
      title: "Trusted Process",
      description: "A transparent, supportive approach to finding the right agency.",
      color: "from-amber-500/20 to-amber-600/5",
      iconColor: "text-amber-400"
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-trust/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/20 text-primary border-primary/40 rounded-full px-4 py-1.5 font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "Why Fostering Matters"}
          </h2>
          {paragraphs?.[0] && (
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              {paragraphs[0]}
            </p>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className={`h-full bg-gradient-to-br ${point.color} bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${point.iconColor}`}>
                  <point.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{point.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
