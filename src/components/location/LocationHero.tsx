import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Building2, Star, Users, Shield, Heart, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LocationHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  flag?: string;
  locationType?: string;
  agencyCount?: number;
  breadcrumbs?: BreadcrumbItem[];
}

export const LocationHero = ({
  title,
  subtitle,
  description,
  badge,
  flag,
  locationType = "directory",
  agencyCount = 0,
  breadcrumbs = [],
}: LocationHeroProps) => {
  const stats = [
    { icon: Building2, value: agencyCount > 0 ? agencyCount.toString() : "500+", label: "Verified Agencies", gradient: "from-primary/30 to-emerald-600/20" },
    { icon: Star, value: "4.8", label: "Avg Rating", gradient: "from-amber-500/30 to-orange-500/20" },
    { icon: Users, value: "500+", label: "Foster Carers", gradient: "from-blue-500/30 to-indigo-500/20" },
    { icon: Shield, value: "100%", label: "Ofsted Rated", gradient: "from-violet-500/30 to-purple-500/20" },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-trust/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-verified/5 rounded-full blur-[180px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-32 left-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white/60" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-40 right-[8%] hidden lg:block"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-verified/40 to-verified/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white/60" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 right-[15%] hidden xl:block"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-amber-400/40" />
        </motion.div>
      </div>

      <div className="container-main relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-8 flex-wrap"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-white/40" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="text-white/60 hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge Row */}
            <div className="flex items-center gap-3 mb-6">
              {flag && <span className="text-4xl">{flag}</span>}
              <Badge className="bg-primary/25 text-primary-foreground border-primary/40 px-4 py-1.5 font-semibold capitalize rounded-full">
                {locationType} Directory
              </Badge>
              {agencyCount > 0 && (
                <Badge className="bg-verified/25 text-verified-foreground border-verified/40 px-4 py-1.5 font-semibold rounded-full">
                  {agencyCount} Agencies
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              {title}
            </h1>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/70 font-medium mb-4">
                {subtitle}
              </p>
            )}
            
            {/* Description */}
            <p className="text-lg text-white/60 max-w-xl leading-relaxed mb-10">
              {description || "Discover verified foster care agencies. Compare services, read reviews, and find the right agency for your fostering journey."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-xl shadow-primary/30 px-8 py-6 text-lg rounded-2xl"
                asChild
              >
                <a href="#agencies">
                  <Building2 className="w-5 h-5 mr-2" />
                  Browse Agencies
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6 text-lg rounded-2xl"
                asChild
              >
                <a href="#enquire">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Enquiry
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-white/10 rounded-3xl p-6`}
              >
                <stat.icon className="w-7 h-7 text-white/80 mb-4" />
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/60 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
