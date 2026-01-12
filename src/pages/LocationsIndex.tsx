import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building2, Search, ArrowRight, Globe, Sparkles, Shield, Star, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTopLevelLocations, useChildLocations, useLocations, Location } from "@/hooks/useLocations";
import { useState, useMemo } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "northern-ireland": "🇬🇧",
};

function CountryCard({ country, index }: { country: Location; index: number }) {
  const { data: regions } = useChildLocations(country.id);
  const [expanded, setExpanded] = useState(false);

  const totalAgencies = regions?.reduce((sum, r) => sum + (r.agency_count || 0), 0) || country.agency_count || 0;
  const flag = countryFlags[country.slug] || "🏴";

  return (
    <motion.div variants={itemVariants}>
      <div className="h-full group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-300">
        <Link to={`/locations/${country.slug}`} className="block p-6">
          <div className="flex items-start gap-4">
            {/* Flag/Icon */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 border border-primary/20">
              {flag}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {country.name}
              </h2>
              <p className="text-white/50 text-sm mb-4 line-clamp-2 leading-relaxed">{country.description}</p>
              
              {/* Stats pills */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-bold">
                  <Building2 className="w-3 h-3 mr-1" />
                  {totalAgencies} agencies
                </Badge>
                {regions && regions.length > 0 && (
                  <Badge className="bg-slate-700 text-white/70 border-slate-600 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {regions.length} regions
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
            </div>
          </div>
        </Link>
        
        {/* Expandable regions */}
        {regions && regions.length > 0 && (
          <div className="border-t border-slate-700/50">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full px-6 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-slate-700/50 transition-all duration-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Explore {regions.length} regions
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
            </button>
            
            {expanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-4 pt-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  {regions.slice(0, 8).map((region) => (
                    <Link
                      key={region.id}
                      to={`/locations/${country.slug}/${region.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group/item"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-medium text-white/80 group-hover/item:text-primary transition-colors">{region.name}</span>
                      </div>
                      <span className="text-xs text-white/40 bg-slate-700 px-2 py-0.5 rounded-full">{region.agency_count || 0}</span>
                    </Link>
                  ))}
                  {regions.length > 8 && (
                    <Link
                      to={`/locations/${country.slug}`}
                      className="flex items-center justify-center p-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors col-span-2 text-sm"
                    >
                      View all {regions.length} regions
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LocationsIndex() {
  const { data: countries, isLoading: countriesLoading } = useTopLevelLocations();
  const { data: allLocations } = useLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Filter locations based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !allLocations) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return allLocations
      .filter((loc) => {
        const nameMatch = loc.name.toLowerCase().includes(query);
        const slugMatch = loc.slug.toLowerCase().includes(query);
        return nameMatch || slugMatch;
      })
      .slice(0, 8);
  }, [searchQuery, allLocations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length === 1) {
      navigate(`/locations/${searchResults[0].slug}`);
      setShowResults(false);
    } else if (searchQuery.trim()) {
      navigate(`/agencies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (location: Location) => {
    navigate(`/locations/${location.slug}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const stats = [
    { icon: Building2, value: "500+", label: "Verified Agencies", color: "bg-primary/20 border-primary/40 text-primary" },
    { icon: Star, value: "4.8", label: "Average Rating", color: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
    { icon: Shield, value: "100%", label: "Ofsted Rated", color: "bg-verified/20 border-verified/40 text-verified" },
    { icon: Users, value: "500+", label: "Foster Carers", color: "bg-trust/20 border-trust/40 text-trust" },
  ];

  const isLoading = countriesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-primary/20 text-primary border border-primary/30 mb-6"
              >
                <Globe className="w-4 h-4" />
                Fostering Across the UK
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Find Foster Care Agencies
                <br />
                <span className="text-primary">Near You</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                Explore verified fostering agencies across England, Scotland, Wales and Northern Ireland. 
                Search by city, county, or postcode to find support in your area.
              </p>

              {/* Search Box */}
              <motion.form 
                onSubmit={handleSearch} 
                className="max-w-2xl mx-auto relative mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search by city, county, region, or postcode..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    className="pl-14 pr-32 py-6 text-base rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary/50"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary hover:bg-primary-hover font-bold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchQuery.trim() && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {searchResults.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleResultClick(location)}
                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-700 transition-colors text-left border-b border-slate-700/50 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{location.name}</p>
                          <p className="text-sm text-white/50 capitalize">
                            {location.type} • {location.agency_count || 0} agencies
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 ml-auto" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {showResults && searchQuery.trim() && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 p-6 text-center"
                  >
                    <p className="text-white font-medium">No locations found for "{searchQuery}"</p>
                    <p className="text-sm text-white/50 mt-1">
                      Try searching for a city, county, or region name
                    </p>
                  </motion.div>
                )}
              </motion.form>

              {/* Stats Boxes */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
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

        {/* Countries Grid - Dark Background */}
        <section className="py-16 bg-slate-900 relative">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Explore by Country</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Foster care systems differ across the UK nations. Select a country to explore local agencies.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl bg-slate-800" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-6"
              >
                {countries?.map((country, index) => (
                  <CountryCard key={country.id} country={country} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats Section - Darker */}
        <section className="py-16 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
          </div>
          
          <div className="container-main relative z-10">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { value: "4", label: "UK Nations", icon: Globe },
                { value: "500+", label: "Verified Agencies", icon: Building2 },
                { value: "50+", label: "Cities Covered", icon: MapPin },
                { value: "10k+", label: "Foster Families", icon: Users },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-900">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-3xl p-12"
            >
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                Ready to Start Your Fostering Journey?
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-8">
                Connect with verified agencies in your area and take the first step towards making a difference in a child's life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/agencies">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover font-bold rounded-xl">
                    Browse All Agencies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold rounded-xl">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
