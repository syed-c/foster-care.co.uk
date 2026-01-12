import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building2, Search, ArrowRight, Globe, Sparkles, Users, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTopLevelLocations, useChildLocations, useLocations, Location } from "@/hooks/useLocations";
import { useState, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  // Gradient backgrounds for each country
  const gradients = [
    "from-rose-500/10 via-orange-500/5 to-amber-500/10",
    "from-blue-500/10 via-indigo-500/5 to-purple-500/10",
    "from-emerald-500/10 via-teal-500/5 to-cyan-500/10",
    "from-amber-500/10 via-yellow-500/5 to-orange-500/10",
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full group hover:shadow-elevated transition-all duration-500 overflow-hidden relative border-0 bg-gradient-to-br from-background to-background-warm">
        {/* Decorative gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % 4]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <CardContent className="p-0 relative">
          <Link to={`/locations/${country.slug}`} className="block p-8">
            <div className="flex items-start gap-5">
              {/* Flag/Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {flag}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {country.name}
                </h2>
                <p className="text-muted-foreground mb-5 line-clamp-2 leading-relaxed">{country.description}</p>
                
                {/* Stats pills */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary border-0">
                    <Building2 className="w-3.5 h-3.5 mr-1.5" />
                    {totalAgencies} agencies
                  </Badge>
                  {regions && regions.length > 0 && (
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-background border border-border/50">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {regions.length} regions
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
          
          {/* Expandable regions */}
          {regions && regions.length > 0 && (
            <div className="border-t border-border/30">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 flex items-center justify-between"
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
                  className="px-8 pb-6 pt-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {regions.slice(0, 8).map((region) => (
                      <Link
                        key={region.id}
                        to={`/locations/${country.slug}/${region.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-200 group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium group-hover/item:text-primary transition-colors">{region.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{region.agency_count || 0}</span>
                      </Link>
                    ))}
                    {regions.length > 8 && (
                      <Link
                        to={`/locations/${country.slug}`}
                        className="flex items-center justify-center p-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-medium transition-colors col-span-2"
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
        </CardContent>
      </Card>
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

  const isLoading = countriesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/30">
          <div className="container-main py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Locations</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section - Modern Gradient Design */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background-warm to-background-sand" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/40 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
          </div>

          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6"
              >
                <Globe className="w-4 h-4" />
                Fostering Across the UK
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Foster Care Agencies
                <br />
                <span className="text-primary relative inline-block">
                  Near You
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/30"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                Explore verified fostering agencies across England, Scotland, Wales and Northern Ireland. 
                Search by city, county, or postcode to find support in your area.
              </p>

              {/* Search Box */}
              <motion.form 
                onSubmit={handleSearch} 
                className="max-w-2xl mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                    className="pl-14 pr-32 h-16 text-lg rounded-2xl border-border/30 bg-background/80 backdrop-blur-sm shadow-lg shadow-foreground/5 focus:shadow-xl focus:border-primary/30 transition-all"
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl shadow-md"
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
                    className="absolute top-full left-0 right-0 mt-3 bg-background border border-border/50 rounded-2xl shadow-elevated z-50 overflow-hidden"
                  >
                    {searchResults.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleResultClick(location)}
                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{location.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {location.type} • {location.agency_count || 0} agencies
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {showResults && searchQuery.trim() && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-background border border-border/50 rounded-2xl shadow-elevated z-50 p-6 text-center"
                  >
                    <p className="text-muted-foreground font-medium">No locations found for "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try searching for a city, county, or region name
                    </p>
                  </motion.div>
                )}
              </motion.form>
            </motion.div>
          </div>
        </section>

        {/* Countries Grid */}
        <section className="section-padding bg-background relative">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Explore by Country</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Foster care systems differ across the UK nations. Select a country to explore local agencies.
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-56 rounded-2xl" />
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

        {/* Stats Section - Modern Cards */}
        <section className="section-padding bg-gradient-to-b from-background to-background-warm relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-3xl" />
          </div>
          
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">The UK's Largest Foster Care Directory</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've helped thousands of families find the right fostering agency
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-white">
              {[
                { icon: Building2, value: "500+", label: "Verified Agencies", color: "from-primary/20 to-primary/5" },
                { icon: MapPin, value: "4", label: "UK Nations", color: "from-blue-500/20 to-blue-500/5" },
                { icon: Users, value: "50+", label: "Regions & Counties", color: "from-emerald-500/20 to-emerald-500/5" },
                { icon: Heart, value: "10K+", label: "Families Helped", color: "from-rose-500/20 to-rose-500/5" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 bg-gradient-to-br from-background to-background-warm shadow-card hover:shadow-elevated transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                        <stat.icon className="w-7 h-7 text-primary" />
                      </div>
                      <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container-main relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Fostering Journey?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Take the first step today. Find an agency near you and make a difference in a child's life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild className="shadow-lg">
                  <Link to="/agencies">
                    <Building2 className="w-5 h-5 mr-2" />
                    Browse All Agencies
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/about">Learn About Fostering</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
