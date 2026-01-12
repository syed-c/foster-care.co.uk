import { motion } from 'framer-motion';
import { Baby, Home, Clock, Heart, Users, Shield, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Category {
  name: string;
  description: string;
}

interface TypesOfFosteringSectionProps {
  heading?: string;
  intro?: string;
  categories?: Category[];
}

const iconMap: Record<string, any> = {
  'emergency': Clock,
  'short': Clock,
  'long': Home,
  'respite': Heart,
  'sibling': Users,
  'parent': Users,
  'specialist': Shield,
  'therapeutic': Heart,
  default: Baby
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  'emergency': { bg: 'from-orange-500/20 to-orange-600/5', icon: 'text-orange-400' },
  'short': { bg: 'from-blue-500/20 to-blue-600/5', icon: 'text-blue-400' },
  'long': { bg: 'from-emerald-500/20 to-emerald-600/5', icon: 'text-emerald-400' },
  'respite': { bg: 'from-purple-500/20 to-purple-600/5', icon: 'text-purple-400' },
  'sibling': { bg: 'from-rose-500/20 to-rose-600/5', icon: 'text-rose-400' },
  'parent': { bg: 'from-cyan-500/20 to-cyan-600/5', icon: 'text-cyan-400' },
  'specialist': { bg: 'from-amber-500/20 to-amber-600/5', icon: 'text-amber-400' },
  'therapeutic': { bg: 'from-pink-500/20 to-pink-600/5', icon: 'text-pink-400' },
  default: { bg: 'from-primary/20 to-primary/5', icon: 'text-primary' }
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (lowerName.includes(key)) return iconMap[key];
  }
  return iconMap.default;
};

const getColors = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(colorMap)) {
    if (lowerName.includes(key)) return colorMap[key];
  }
  return colorMap.default;
};

export const TypesOfFosteringSection = ({ 
  heading, 
  intro, 
  categories 
}: TypesOfFosteringSectionProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      
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
            Fostering Types
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "Types of Fostering"}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {intro || "Explore the different types of fostering opportunities available."}
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = getIcon(category.name);
            const colors = getColors(category.name);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className={`h-full bg-gradient-to-br ${colors.bg} bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colors.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{category.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
