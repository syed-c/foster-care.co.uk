import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Search, Filter, Star, MapPin, BadgeCheck, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAgencies } from "@/hooks/useAgencies";
import { Skeleton } from "@/components/ui/skeleton";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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

export default function AgenciesListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [minRating, setMinRating] = useState(0);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: agencies, isLoading } = useAgencies({
    search: searchQuery || undefined,
    location: selectedLocation !== "All Locations" ? selectedLocation : undefined,
    minRating: minRating > 0 ? minRating : undefined,
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-background to-background-warm py-12 md:py-16 border-b border-border/50">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 text-sm font-medium text-primary">Directory</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                Find Foster Care Agencies
              </h1>
              <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                Browse our comprehensive directory of verified foster care agencies across the UK.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by agency name, location, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-card border-border text-base text-foreground placeholder:text-foreground/50 shadow-sm" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="section-padding bg-background">
          <div className="container-main">
            {/* Filters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card border border-border/50 rounded-xl"
            >
              <div className="text-foreground/60">
                {isLoading ? (
                  <Skeleton className="h-5 w-32 inline-block" />
                ) : (
                  <>
                    Showing <span className="font-semibold text-foreground">{filteredAgencies.length}</span> agencies
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="default" className="md:hidden">
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Refine your search results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-foreground">Location</Label>
                        <div className="space-y-2">
                          {locations.map((loc) => (
                            <button
                              key={loc}
                              onClick={() => setSelectedLocation(loc)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedLocation === loc
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-foreground">Minimum Rating</Label>
                        <Slider
                          value={[minRating]}
                          onValueChange={([value]) => setMinRating(value)}
                          max={5}
                          min={0}
                          step={0.5}
                          className="py-4"
                        />
                        <p className="text-sm text-foreground/80">
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
                          <Label htmlFor="verified-mobile" className="text-foreground">Verified only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured-mobile"
                            checked={showFeaturedOnly}
                            onCheckedChange={(checked) => setShowFeaturedOnly(!!checked)}
                          />
                          <Label htmlFor="featured-mobile" className="text-foreground">Featured only</Label>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <Button variant="outline" onClick={clearFilters} className="w-full">
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
                      <Button variant="secondary" size="default">
                        <MapPin className="w-4 h-4" />
                        {selectedLocation}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {locations.map((loc) => (
                        <DropdownMenuItem
                          key={loc}
                          onClick={() => setSelectedLocation(loc)}
                          className={selectedLocation === loc ? "bg-primary/10" : ""}
                        >
                          {loc}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="default">
                        <Star className="w-4 h-4" />
                        {minRating > 0 ? `${minRating}+ Stars` : "Rating"}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {ratingOptions.map((opt) => (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => setMinRating(opt.value)}
                          className={minRating === opt.value ? "bg-primary/10" : ""}
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
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </Button>

                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="default" onClick={clearFilters}>
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Agency Cards */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-full bg-card text-foreground border border-border/50 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-16 w-full mb-4" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAgencies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-xl font-medium text-foreground mb-2">No agencies found</p>
                <p className="text-foreground/80 mb-6">
                  Try adjusting your search or filters
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAgencies.map((agency) => (
                  <motion.div key={agency.id} variants={cardVariants}>
                    <Link to={`/agencies/${agency.slug}`}>
                      <Card className="h-full bg-card text-foreground group transition-all duration-300 hover:scale-105 border border-border/50 shadow-sm rounded-xl overflow-hidden hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg text-foreground group-hover:text-foreground transition-colors line-clamp-1">
                                  {agency.name}
                                </h3>
                                {agency.is_verified && (
                                  <BadgeCheck className="w-5 h-5 text-foreground flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/60">
                                <MapPin className="w-4 h-4 text-foreground" />
                                {agency.city || "Nationwide"}
                              </div>
                            </div>
                            {agency.is_featured && (
                              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
                            {agency.description || "A trusted foster care agency providing support across the UK."}
                          </p>

                          <div className="flex items-center gap-2 pt-4 border-t border-border">
                            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                              <Star className="w-4 h-4 text-primary fill-primary" />
                              <span className="font-semibold text-sm text-foreground">
                                {agency.rating ? Number(agency.rating).toFixed(1) : "New"}
                              </span>
                            </div>
                            <span className="text-sm text-foreground/60">
                              ({agency.review_count || 0} reviews)
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
