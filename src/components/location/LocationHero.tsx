import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Building2, Star, Users, Shield, Heart, Sparkles, Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  const stats = [
    { icon: Building2, value: agencyCount > 0 ? agencyCount.toString() : "50+", label: "Verified Agencies", color: "bg-primary/20 border-primary/40 text-primary" },
    { icon: Star, value: "4.8", label: "Average Rating", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
    { icon: Shield, value: "100%", label: "Ofsted Rated", color: "bg-verified/20 border-verified/40 text-verified" },
    { icon: Users, value: "500+", label: "Foster Carers", color: "bg-trust/20 border-trust/40 text-trust" },
  ];

  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-verified/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-trust/10 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        
        {/* Floating decorative icons */}
        <motion.div 
          className="absolute top-20 left-[15%] hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-primary/20">
            <Heart className="w-7 h-7 text-primary" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute top-32 right-[12%] hidden lg:block"
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-verified/30 to-verified/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-verified/20">
            <Shield className="w-8 h-8 text-verified" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-[10%] hidden xl:block"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-40 right-[18%] hidden xl:block"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary/50" />
        </motion.div>
      </div>

      <div className="container-main relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm mb-8 flex-wrap"
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

        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            {flag && <span className="text-4xl">{flag}</span>}
            <Badge className="bg-primary/25 text-primary border-primary/40 px-4 py-1.5 font-bold capitalize rounded-full text-sm">
              {locationType} Directory
            </Badge>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight"
          >
            {title}
          </motion.h1>
          
          {/* Subtitle */}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/70 font-medium mb-4"
            >
              {subtitle}
            </motion.p>
          )}
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {description || "Discover verified foster care agencies. Compare services, read reviews, and find the right agency for your fostering journey."}
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-xl mx-auto mb-10"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search agencies by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl text-base focus:border-primary/50 focus:ring-primary/30"
              />
              <Button 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-6"
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* Stats Boxes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.08 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`flex items-center gap-3 ${stat.color} backdrop-blur-sm border rounded-full px-5 py-2.5 shadow-lg`}
              >
                <stat.icon className="w-4 h-4" />
                <span className="font-bold text-sm">{stat.value}</span>
                <span className="text-xs text-white/60 hidden sm:inline">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 40V80H0Z" className="fill-slate-900" />
        </svg>
      </div>
    </section>
  );
};