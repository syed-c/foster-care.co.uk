"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";

import { motion } from "framer-motion";
import { Search, Filter, Star, MapPin, BadgeCheck, ChevronDown, X, Building2, Shield, Users, Phone, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgencies } from "@/hooks/useAgencies";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Agency } from "@/services/dataService";

interface AgenciesListingProps {
  initialAgencies?: Agency[];
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const locations = [
  "All Locations",
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Bristol",
  "Liverpool",
  "Newcastle",
  "Sheffield",
];

const ratingOptions = [
  { value: 0, label: "All Ratings" },
  { value: 4, label: "4+ Stars" },
  { value: 4.5, label: "4.5+ Stars" },
];

export default function AgenciesListing({ initialAgencies }: AgenciesListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [minRating, setMinRating] = useState(0);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: agenciesData, isLoading: agenciesLoading } = useAgencies({
    search: searchQuery || undefined,
    location: selectedLocation !== "All Locations" ? selectedLocation : undefined,
    minRating: minRating > 0 ? minRating : undefined,
  });

  const agencies = agenciesData || initialAgencies;
  const isLoading = agenciesLoading && !initialAgencies;

  const filteredAgencies = useMemo(() => {
    if (!agencies) return [];

    return agencies.filter((agency) => {
      if (showVerifiedOnly && !agency.is_verified) return false;
      if (showFeaturedOnly && !agency.is_featured) return false;
      return true;
    });
  }, [agencies, showVerifiedOnly, showFeaturedOnly]);

  const activeFiltersCount = [
    selectedLocation !== "All Locations",
    minRating > 0,
    showVerifiedOnly,
    showFeaturedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setMinRating(0);
    setShowVerifiedOnly(false);
    setShowFeaturedOnly(false);
  };

  const stats = [
    { icon: Building2, value: filteredAgencies.length.toString() || "500+", label: "Agencies", color: "bg-primary/20 border-primary/40 text-primary" },
    { icon: Star, value: "4.8", label: "Avg Rating", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
    { icon: Shield, value: "100%", label: "Ofsted Rated", color: "bg-verified/20 border-verified/40 text-verified" },
    { icon: Users, value: "500+", label: "Foster Carers", color: "bg-trust/20 border-trust/40 text-trust" },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pt-20">
        {/* Hero Section - Dark Style */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Dark Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[180px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-verified/15 rounded-full blur-[150px]" />
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }} />
          </div>

          <div className="container-main relative z-10">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 font-bold rounded-full text-sm mb-6">
                Agency Directory
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                Find Foster Care Agencies
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
                Browse our comprehensive directory of verified foster care agencies across the UK.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-10">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search by agency name, location, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-32 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl text-base focus:border-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-24 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl px-6">
                  Search
                </Button>
              </div>

              {/* Stats Boxes */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                    className={`flex items-center gap-3 ${stat.color} backdrop-blur-sm border rounded-full px-5 py-2.5 shadow-lg`}
                  >
                    <stat.icon className="w-4 h-4" />
                    <span className="font-bold text-sm">{stat.value}</span>
                    <span className="text-xs text-white/60 hidden sm:inline">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 40V80H0Z" className="fill-slate-900" />
            </svg>
          </div>
        </section>

        {/* Filters & Results - Dark Background */}
        <section className="py-12 bg-slate-900">
          <div className="container-main">
            {/* Filters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl"
            >
              <div className="text-white/60">
                {isLoading ? (
                  <Skeleton className="h-5 w-32 inline-block bg-slate-700" />
                ) : (
                  <>
                    Showing <span className="font-semibold text-white">{filteredAgencies.length}</span> agencies
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="default" className="md:hidden bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-slate-900 border-slate-700">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filters</SheetTitle>
                      <SheetDescription className="text-white/60">
                        Refine your search results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-white">Location</Label>
                        <div className="space-y-2">
                          {locations.map((loc) => (
                            <button
                              key={loc}
                              onClick={() => setSelectedLocation(loc)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedLocation === loc
                                ? "bg-primary text-primary-foreground"
                                : "text-white/70 hover:bg-slate-700"
                                }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white">Minimum Rating</Label>
                        <Slider
                          value={[minRating]}
                          onValueChange={([value]) => setMinRating(value)}
                          max={5}
                          min={0}
                          step={0.5}
                          className="py-4"
                        />
                        <p className="text-sm text-white/60">
                          {minRating > 0 ? `${minRating}+ stars` : "All ratings"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="verified-mobile"
                            checked={showVerifiedOnly}
                            onCheckedChange={(checked) => setShowVerifiedOnly(!!checked)}
                          />
                          <Label htmlFor="verified-mobile" className="text-white">Verified only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured-mobile"
                            checked={showFeaturedOnly}
                            onCheckedChange={(checked) => setShowFeaturedOnly(!!checked)}
                          />
                          <Label htmlFor="featured-mobile" className="text-white">Featured only</Label>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <Button variant="outline" onClick={clearFilters} className="w-full border-slate-600 text-white hover:bg-slate-700">
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Filters */}
                <div className="hidden md:flex gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="default" className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                        <MapPin className="w-4 h-4" />
                        {selectedLocation}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
                      {locations.map((loc) => (
                        <DropdownMenuItem
                          key={loc}
                          onClick={() => setSelectedLocation(loc)}
                          className={`text-white/80 hover:text-white hover:bg-slate-700 ${selectedLocation === loc ? "bg-primary/20" : ""}`}
                        >
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="default" className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                        <Star className="w-4 h-4" />
                        {minRating > 0 ? `${minRating}+ Stars` : "Rating"}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      {ratingOptions.map((opt) => (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => setMinRating(opt.value)}
                          className={`text-white/80 hover:text-white hover:bg-slate-700 ${minRating === opt.value ? "bg-primary/20" : ""}`}
                        >
                          {opt.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant={showVerifiedOnly ? "default" : "secondary"}
                    size="default"
                    onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                    className={showVerifiedOnly ? "" : "bg-slate-700 text-white border-slate-600 hover:bg-slate-600"}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </Button>

                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="default" onClick={clearFilters} className="text-white/60 hover:text-white hover:bg-slate-700">
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Agency Listings - Line Format */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-xl bg-slate-700" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2 bg-slate-700" />
                        <Skeleton className="h-4 w-32 bg-slate-700" />
                      </div>
                      <Skeleton className="h-10 w-24 bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAgencies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-xl font-medium text-white mb-2">No agencies found</p>
                <p className="text-white/60 mb-6">
                  Try adjusting your search or filters
                </p>
                <Button variant="secondary" onClick={clearFilters} className="bg-slate-700 text-white hover:bg-slate-600">
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredAgencies.map((agency, index) => (
                  <motion.div
                    key={agency.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        {agency.logo_url ? (
                          <img src={agency.logo_url} alt={agency.name} className="w-12 h-12 object-contain rounded-lg" />
                        ) : (
                          <Building2 className="w-8 h-8 text-primary" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-lg truncate">{agency.name}</h3>
                          {agency.is_verified && (
                            <Badge className="bg-verified/20 text-verified border-verified/30 text-xs">
                              <BadgeCheck className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {agency.is_featured && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {agency.city || "Nationwide"}
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-amber-400">
                          {agency.rating ? Number(agency.rating).toFixed(1) : "New"}
                        </span>
                        <span className="text-xs text-white/40">({agency.review_count || 0})</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <a href="#enquire">
                          <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold">
                            <Phone className="w-4 h-4 mr-1" />
                            Book
                          </Button>
                        </a>
                        <Link href={`/agencies/${agency.slug}`}>
                          <Button size="sm" variant="secondary" className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 font-bold">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
