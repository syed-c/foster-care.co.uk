import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Shield, Users, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCmsContentSection } from "@/hooks/useCmsContent";
import { useLocations } from "@/hooks/useLocations";

const rotatingWords = ["Foster Carer", "Family", "Support", "Agency"];

export function HeroSection() {
  const navigate = useNavigate();
  const { data: heroContent } = useCmsContentSection("home", "hero");
  const { data: locations } = useLocations();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const title = heroContent?.title || "Finding the Right Foster Care Agency";
  const subtitle = heroContent?.subtitle || "Serving Foster Families Across the UK";
  const content = heroContent?.content || "Compare verified agencies, read reviews, and connect with the right fostering support in seconds.";

  // Rotate words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);
    navigate(`/agencies${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const stats = [
    { icon: Users, value: "500+", label: "VERIFIED AGENCIES" },
    { icon: Shield, value: "100%", label: "OFSTED RATED" },
    { icon: Star, value: "4.8", label: "AVERAGE RATING" },
    { icon: Clock, value: "24h", label: "RESPONSE TIME" },
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-warm/50 to-background z-0" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Floating plus signs */}
        <motion.div 
          className="absolute top-32 left-20 text-primary/20 text-4xl font-light"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </motion.div>
        <motion.div 
          className="absolute top-40 right-32 text-primary/15 text-5xl font-light"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-1/4 text-primary/10 text-3xl font-light"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </motion.div>
        
        {/* Subtle gradient blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10 py-12 md:py-20 text-center max-w-5xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-8"
        >
          <CheckCircle className="w-4 h-4" />
          {subtitle}
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 tracking-tight text-foreground"
        >
          Find Your Perfect
          <br />
          <span className="text-primary relative inline-block min-w-[280px] sm:min-w-[340px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[currentWordIndex]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {rotatingWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {content}
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-background rounded-2xl shadow-xl border border-border/50 p-2 max-w-3xl mx-auto mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Location Select */}
            <div className="flex-1">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-14 border-0 bg-transparent text-left px-4 focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="All Locations" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.slug}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-border self-stretch my-2" />

            {/* Type Select */}
            <div className="flex-1">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-14 border-0 bg-transparent text-left px-4 focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="All Agency Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agency Types</SelectItem>
                  <SelectItem value="independent">Independent Agency</SelectItem>
                  <SelectItem value="local-authority">Local Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
