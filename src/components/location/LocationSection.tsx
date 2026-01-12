import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationSectionProps {
  title: string;
  subtitle?: string;
  badge?: {
    icon: LucideIcon;
    label: string;
    color?: string;
  };
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  centered?: boolean;
}

export const LocationSection = ({
  title,
  subtitle,
  badge,
  children,
  className = "",
  dark = true,
  centered = false,
}: LocationSectionProps) => {
  const bgClass = dark 
    ? "bg-gradient-to-b from-secondary/95 to-secondary" 
    : "bg-gradient-to-b from-background to-background-warm";
  
  const textClass = dark ? "text-white" : "text-foreground";
  const subtitleClass = dark ? "text-white/60" : "text-muted-foreground";

  return (
    <section className={`py-14 md:py-20 ${bgClass} ${className}`}>
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}
        >
          {badge && (
            <Badge className={`${badge.color || 'bg-primary/20 text-primary border-primary/30'} mb-4 rounded-full px-4 py-1.5`}>
              <badge.icon className="w-3.5 h-3.5 mr-1.5" />
              {badge.label}
            </Badge>
          )}
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold ${textClass} mb-3 tracking-tight`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg ${subtitleClass}`}>
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
};
