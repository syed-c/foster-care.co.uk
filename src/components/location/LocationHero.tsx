"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Building2, Star, Users, Shield, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  childLocations?: { id: string; name: string; slug: string }[];
  currentLocationPath?: string;
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
  childLocations = [],
  currentLocationPath = "",
}: LocationHeroProps) => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");

  const stats = [
    { icon: Building2, value: agencyCount > 0 ? agencyCount.toString() : "50+", label: "Agencies", color: "bg-primary/20 border-primary/40 text-primary" },
    { icon: Star, value: "4.8", label: "Rating", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
    { icon: Shield, value: "100%", label: "Ofsted", color: "bg-verified/20 border-verified/40 text-verified" },
    { icon: Users, value: "500+", label: "Carers", color: "bg-trust/20 border-trust/40 text-trust" },
  ];

  const handleLocationSelect = (slug: string) => {
    setSelectedLocation(slug);
    if (slug) {
      const path = currentLocationPath ? `${currentLocationPath}/${slug}` : `/locations/${slug}`;
      router.push(path);
    }
  };

  // Truncate description to ~2 lines
  const shortDescription = description && description.length > 120
    ? description.slice(0, 120).trim() + "..."
    : description;

  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-verified/10 rounded-full blur-[100px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container-main relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-1.5 text-xs mb-5 flex-wrap"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3 h-3 text-white/40" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white/50 hover:text-white transition-colors">
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
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            {flag && <span className="text-2xl">{flag}</span>}
            <Badge className="bg-primary/25 text-primary border-primary/40 px-3 py-1 font-bold capitalize rounded-full text-xs">
              {locationType} Directory
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3 tracking-tight"
          >
            {title}
          </motion.h1>

          {/* Description - Max 2 lines */}
          {shortDescription && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm md:text-base text-white/50 max-w-xl mx-auto leading-relaxed mb-6 line-clamp-2"
            >
              {shortDescription}
            </motion.p>
          )}

          {/* Location Filter */}
          {childLocations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-6 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                <Select value={selectedLocation} onValueChange={handleLocationSelect}>
                  <SelectTrigger className="w-full pl-10 pr-4 py-5 bg-white/10 border-white/20 text-white rounded-xl text-sm focus:border-primary/50">
                    <SelectValue placeholder="Select a location to explore..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {childLocations.map((loc) => (
                      <SelectItem
                        key={loc.id}
                        value={loc.slug}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => selectedLocation && handleLocationSelect(selectedLocation)}
                className="bg-primary hover:bg-primary-hover text-white font-bold rounded-xl px-5 py-5"
                disabled={!selectedLocation}
              >
                Go
              </Button>
            </motion.div>
          )}

          {/* Compact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.5 + index * 0.05 }}
                className={`flex items-center gap-2 ${stat.color} backdrop-blur-sm border rounded-full px-3 py-1.5 shadow-lg`}
              >
                <stat.icon className="w-3.5 h-3.5" />
                <span className="font-bold text-xs">{stat.value}</span>
                <span className="text-[10px] text-white/50 hidden sm:inline">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 50V25C240 8 480 0 720 12C960 24 1200 30 1440 25V50H0Z" className="fill-slate-900" />
        </svg>
      </div>
    </section>
  );
};
