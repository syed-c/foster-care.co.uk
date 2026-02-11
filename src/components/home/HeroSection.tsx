"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Users, Star, Clock, MapPin, Heart, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCmsContentSection } from "@/hooks/useCmsContent";
import { useLocations } from "@/hooks/useLocations";
import { Input } from "@/components/ui/input";
import { CmsContent, getContentBySection } from "@/hooks/useCmsContent";
import Image from "next/image";

const rotatingServices = ["Emergency Care", "Short-term Fostering", "Long-term Placements", "Sibling Groups", "Respite Care"];

interface HeroSectionProps {
  initialData?: CmsContent[];
}

export function HeroSection({ initialData }: HeroSectionProps) {
  const router = useRouter();
  const { data: heroContent } = useCmsContentSection("home", "hero");

  // Use server-provided data if client query is still loading
  const effectiveHeroContent = heroContent || (initialData ? getContentBySection(initialData, "hero") : null);
  const { data: locations } = useLocations();
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const metadata = (effectiveHeroContent as any)?.metadata as Record<string, string> | null;
  const title = (effectiveHeroContent as any)?.title;
  const subtitle = metadata?.subtitle;
  const content = (effectiveHeroContent as any)?.content;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex(prev => (prev + 1) % rotatingServices.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation);
    if (selectedType && selectedType !== "all") params.set("type", selectedType);
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/agencies${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const stats = [
    { icon: Building2, value: "500+", label: "Ofsted-Registered Agencies", color: "bg-primary/20 border-primary/40 text-primary" },
    { icon: Star, value: "4.8", label: "Average Carer Rating", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
    { icon: Shield, value: "100%", label: "Verified & Checked", color: "bg-verified/20 border-verified/40 text-verified" },
    { icon: Users, value: "24h", label: "Avg Response Time", color: "bg-trust/20 border-trust/40 text-trust" },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Static BG Fallback for SEO/Performance */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/foster-family-hero.png"
          alt="Happy foster family"
          fill
          priority
          className="object-cover opacity-20 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

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
          className="absolute top-32 left-[15%] hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-primary/20">
            <Heart className="w-7 h-7 text-primary" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-48 right-[12%] hidden lg:block"
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-verified/30 to-verified/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-verified/20">
            <Shield className="w-8 h-8 text-verified" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-[10%] hidden xl:block"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-500/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-48 right-[18%] hidden xl:block"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary/50" />
        </motion.div>
      </div>

      <div className="container-main relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {subtitle && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30 mb-8 px-4 py-2"
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-4 h-4" />
            </motion.div>
            {subtitle}
          </motion.div>
        )}

        {/* Main Heading */}
        {title && (
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-6 tracking-tight text-white"
          >
            {title}
          </motion.h1>
        )}

        {/* Rotating Services Text */}
        {rotatingServices.length > 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/60 mb-6 h-8 flex items-center justify-center gap-2"
          >
            <span>Specializing in</span>
            <span className="text-primary font-bold relative inline-block min-w-[180px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingServices[currentServiceIndex]}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: 90 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="inline-block"
                >
                  {rotatingServices[currentServiceIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
        )}

        {/* Description */}
        {content && (
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {content}
          </motion.p>
        )}

        {/* Search Bar */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl px-6"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Stats Boxes */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 ${stat.color} backdrop-blur-sm border rounded-full px-5 py-2.5 shadow-lg`}
            >
              <stat.icon className="w-4 h-4" />
              <span className="font-bold text-sm">{stat.value}</span>
              <span className="text-xs text-white/60 hidden sm:inline">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-4">
            Trusted by Leading Organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {[
              { name: "Ofsted", subtitle: "Registered" },
              { name: "The Fostering Network", subtitle: "Member" },
              { name: "BAAF", subtitle: "Accredited" },
              { name: "DfE", subtitle: "Compliant" },
              { name: "CoramBAAF", subtitle: "Partner" },
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              >
                <span className="text-sm font-semibold text-white">{partner.name}</span>
                <span className="text-[10px] text-white/50">{partner.subtitle}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 40V80H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
