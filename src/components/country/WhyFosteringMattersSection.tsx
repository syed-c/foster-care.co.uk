import { motion } from 'framer-motion';
import { Shield, Heart, Users, CheckCircle } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

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
      gradient: "from-emerald-500/20 to-emerald-600/5"
    },
    {
      icon: Heart,
      title: "Child-Focused",
      description: "Every connection we facilitate puts the welfare of children first.",
      gradient: "from-rose-500/20 to-rose-600/5"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Experienced professionals guiding you through your fostering journey.",
      gradient: "from-blue-500/20 to-blue-600/5"
    },
    {
      icon: CheckCircle,
      title: "Trusted Process",
      description: "A transparent, supportive approach to finding the right agency.",
      gradient: "from-amber-500/20 to-amber-600/5"
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "Why Fostering Matters"}
            </h2>
            {paragraphs?.[0] && (
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                {paragraphs[0]}
              </p>
            )}
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className={`h-full bg-gradient-to-br ${point.gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300`}>
                <motion.div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <point.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};