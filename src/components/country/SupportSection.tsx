import { motion } from 'framer-motion';
import { Phone, BookOpen, Users, Heart, Shield, MessageCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface Category {
  name: string;
  description: string;
}

interface SupportSectionProps {
  heading?: string;
  categories?: Category[];
}

const iconMap: Record<string, any> = {
  'training': BookOpen,
  'financial': Shield,
  'emotional': Heart,
  'peer': Users,
  'helpline': Phone,
  'mentoring': MessageCircle,
  default: Heart
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (lowerName.includes(key)) return iconMap[key];
  }
  return iconMap.default;
};

export const SupportSection = ({ 
  heading, 
  categories 
}: SupportSectionProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "Support for Foster Carers"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive support available throughout your fostering journey
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = getIcon(category.name);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-primary/5 to-transparent rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};