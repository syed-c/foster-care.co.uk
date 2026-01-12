import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Shield, Users, Star, Clock, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCmsContentSection } from "@/hooks/useCmsContent";
import { useLocations } from "@/hooks/useLocations";

const rotatingServices = ["Emergency Care", "Short-term Fostering", "Long-term Placements", "Sibling Groups", "Respite Care"];

export function HeroSection() {
  const navigate = useNavigate();
  const { data: heroContent } = useCmsContentSection("home", "hero");
  const { data: locations } = useLocations();
  
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Get content from CMS/database
  const title = heroContent?.title || "Finding the Right Foster Care Agency";
  const subtitle = heroContent?.subtitle || "Serving Foster Families Across the UK";
  const content = heroContent?.content || "Connect with trusted foster care agencies across the United Kingdom. Every child deserves a loving home, and we're here to help you find the right support.";

  // Rotate services
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % rotatingServices.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation);
    if (selectedType && selectedType !== "all") params.set("type", selectedType);
    navigate(`/agencies${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const stats = [
    { icon: Users, value: "500+", label: "VERIFIED AGENCIES" },
    { icon: Shield, value: "100%", label: "OFSTED RATED" },
    { icon: Star, value: "4.8", label: "AVERAGE RATING" },
    { icon: Clock, value: "24h", label: "RESPONSE TIME" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafa] via-[#f0f7f7] to-background z-0" />
      
      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Floating Plus Signs - Animated */}
        <motion.div 
          className="absolute top-28 left-[8%] text-primary/25 text-5xl font-extralight select-none"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0],
            opacity: [0.25, 0.35, 0.25]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </motion.div>
        <motion.div 
          className="absolute top-36 right-[12%] text-primary/20 text-6xl font-extralight select-none"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -8, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          +
        </motion.div>
        <motion.div 
          className="absolute bottom-44 left-[15%] text-primary/15 text-4xl font-extralight select-none"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 5, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          +
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-[8%] text-primary/20 text-5xl font-extralight select-none"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 10, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          +
        </motion.div>

        {/* Floating Heart Icons */}
        <motion.div 
          className="absolute top-1/3 left-[5%]"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8 text-primary/20 fill-primary/10" />
        </motion.div>
        <motion.div 
          className="absolute top-1/2 right-[6%]"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Heart className="w-10 h-10 text-primary/15 fill-primary/5" />
        </motion.div>

        {/* Floating Circles */}
        <motion.div 
          className="absolute top-40 left-[20%] w-3 h-3 rounded-full bg-primary/20"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 10, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-60 right-[18%] w-4 h-4 rounded-full bg-accent/40"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-60 left-[25%] w-2 h-2 rounded-full bg-primary/30"
          animate={{ 
            y: [0, -15, 0],
            x: [0, -8, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div 
          className="absolute bottom-48 right-[22%] w-3 h-3 rounded-full bg-primary/25"
          animate={{ 
            y: [0, 18, 0],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        />

        {/* Large decorative tooth-like shape (like reference) */}
        <motion.div 
          className="absolute top-32 left-[3%] opacity-20"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="text-primary">
            <path d="M40 10C25 10 15 25 15 40C15 55 20 70 25 85C28 95 32 95 35 85C38 75 42 75 45 85C48 95 52 95 55 85C60 70 65 55 65 40C65 25 55 10 40 10Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </motion.div>
        
        {/* Gradient blobs */}
        <div className="absolute top-10 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      <div className="container-main relative z-10 text-center max-w-5xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-10"
        >
          <CheckCircle className="w-4 h-4" />
          {subtitle}
        </motion.div>

        {/* Main Heading - FROM DATABASE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-foreground"
        >
          {title}
        </motion.h1>

        {/* Rotating Services Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xl md:text-2xl text-muted-foreground mb-6 h-8"
        >
          <span>Specializing in </span>
          <span className="text-primary font-medium relative inline-block min-w-[200px] text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingServices[currentServiceIndex]}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {rotatingServices[currentServiceIndex]}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          </span>
        </motion.div>

        {/* Description - FROM DATABASE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {content}
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-background rounded-2xl shadow-xl shadow-primary/5 border border-border/60 p-2 max-w-3xl mx-auto mb-16"
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
          className="flex flex-wrap justify-center gap-10 md:gap-14 lg:gap-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
