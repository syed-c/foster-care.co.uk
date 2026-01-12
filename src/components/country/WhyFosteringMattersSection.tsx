import { motion } from 'framer-motion';
import { Shield, Heart, Users, CheckCircle, Award, Clock } from 'lucide-react';

interface WhyFosteringMattersSectionProps {
  heading?: string;
  paragraphs?: string[];
}

export const WhyFosteringMattersSection = ({ heading, paragraphs }: WhyFosteringMattersSectionProps) => {
  if (!paragraphs || paragraphs.length === 0) return null;

  // Define trust points similar to homepage
  const trustPoints = [
    {
      icon: Shield,
      title: "Verified Agencies",
      description: "All agencies are checked and verified to ensure quality care standards.",
    },
    {
      icon: Heart,
      title: "Child-Focused",
      description: "Every connection we facilitate puts the welfare of children first.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Experienced professionals guiding you through your fostering journey.",
    },
    {
      icon: CheckCircle,
      title: "Trusted Process",
      description: "A transparent, supportive approach to finding the right agency.",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "Why Fostering Matters"}
        </motion.h2>
      </div>

      {/* Trust Points Grid - using feature blocks with icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto"
      >
        {trustPoints.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40 hover:shadow-lg transition-all duration-300 h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <point.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{point.title}</h3>
              <p className="text-muted-foreground text-sm">{point.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
