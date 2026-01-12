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
  variant?: "default" | "gradient" | "pattern";
}

export const LocationSection = ({
  title,
  subtitle,
  badge,
  children,
  className = "",
  dark = true,
  centered = false,
  variant = "default",
}: LocationSectionProps) => {
  const getBgClass = () => {
    if (variant === "gradient") return "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950";
    if (variant === "pattern") return "bg-slate-900";
    return dark ? "bg-slate-900" : "bg-gradient-to-b from-background to-background-warm";
  };

  return (
    <section className={`py-14 md:py-20 ${getBgClass()} relative overflow-hidden ${className}`}>
      {/* Optional decorative elements based on variant */}
      {variant === "pattern" && (
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
      )}
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}
        >
          {badge && (
            <Badge className={`${badge.color || 'bg-primary/20 text-primary border-primary/40'} mb-4 rounded-full px-4 py-1.5 font-bold`}>
              <badge.icon className="w-3.5 h-3.5 mr-1.5" />
              {badge.label}
            </Badge>
          )}
          <h2 className={`text-3xl md:text-4xl font-black ${dark ? 'text-white' : 'text-foreground'} mb-3 tracking-tight`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
};
