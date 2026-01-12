import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Shield, Users, Star, Clock, MapPin, Heart, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCmsContentSection } from "@/hooks/useCmsContent";
import { useLocations } from "@/hooks/useLocations";
const rotatingServices = ["Emergency Care", "Short-term Fostering", "Long-term Placements", "Sibling Groups", "Respite Care"];
export function HeroSection() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const {
    scrollY
  } = useScroll();

  // Parallax transforms for floating elements
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, -120]);
  const y3 = useTransform(scrollY, [0, 500], [0, -60]);
  const y4 = useTransform(scrollY, [0, 500], [0, -100]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 15]);
  const rotate2 = useTransform(scrollY, [0, 500], [0, -20]);
  const scale1 = useTransform(scrollY, [0, 300], [1, 0.9]);
  const {
    data: heroContent
  } = useCmsContentSection("home", "hero");
  const {
    data: locations
  } = useLocations();
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
      setCurrentServiceIndex(prev => (prev + 1) % rotatingServices.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation);
    if (selectedType && selectedType !== "all") params.set("type", selectedType);
    navigate(`/agencies${params.toString() ? `?${params.toString()}` : ""}`);
  };
  const stats = [{
    icon: Users,
    value: "500+",
    label: "VERIFIED AGENCIES"
  }, {
    icon: Shield,
    value: "100%",
    label: "OFSTED RATED"
  }, {
    icon: Star,
    value: "4.8",
    label: "AVERAGE RATING"
  }, {
    icon: Clock,
    value: "24h",
    label: "RESPONSE TIME"
  }];
  return <section ref={containerRef} className="relative min-h-[110vh] flex flex-col items-center justify-center pt-28 pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafa] via-[#f0f7f7] to-background z-0 py-0 px-0" />
      
      {/* Decorative Floating Elements with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
        
        {/* 3D Floating Card - Left Side */}
        <motion.div style={{
        y: y1,
        rotate: rotate1
      }} className="absolute top-36 left-[5%] hidden lg:block">
          <motion.div animate={{
          y: [0, -15, 0],
          rotateY: [0, 10, 0],
          rotateX: [0, 5, 0]
        }} transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="relative w-48 h-32 rounded-2xl bg-gradient-to-br from-white to-primary/5 shadow-2xl shadow-primary/20 border border-white/50 backdrop-blur-sm p-4" style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Foster Care</div>
                <div className="text-[10px] text-muted-foreground">Agency Directory</div>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Floating Card - Right Side */}
        <motion.div style={{
        y: y2,
        rotate: rotate2
      }} className="absolute top-48 right-[4%] hidden lg:block">
          <motion.div animate={{
          y: [0, 12, 0],
          rotateY: [-5, 5, -5],
          rotateX: [0, -5, 0]
        }} transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }} className="relative w-52 h-28 rounded-2xl bg-gradient-to-br from-white to-accent/30 shadow-2xl shadow-accent/30 border border-white/60 backdrop-blur-sm p-4" style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="text-sm font-semibold text-foreground">Trusted by Families</span>
            </div>
            <div className="flex -space-x-2 mt-2">
              {[...Array(4)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-white flex items-center justify-center text-xs font-medium text-primary">
                  {["A", "B", "C", "D"][i]}
                </div>)}
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                +99
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Floating Badge - Bottom Left */}
        <motion.div style={{
        y: y3
      }} className="absolute bottom-40 left-[8%] hidden md:block">
          <motion.div animate={{
          y: [0, -10, 0],
          rotate: [-3, 3, -3],
          scale: [1, 1.05, 1]
        }} transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white shadow-lg shadow-green-500/30">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Ofsted Verified</span>
          </motion.div>
        </motion.div>

        {/* 3D Floating Badge - Bottom Right */}
        <motion.div style={{
        y: y4
      }} className="absolute bottom-52 right-[10%] hidden md:block">
          <motion.div animate={{
          y: [0, 8, 0],
          rotate: [3, -3, 3],
          scale: [1, 1.03, 1]
        }} transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/90 to-primary/70 text-white shadow-lg shadow-primary/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Free Matching</span>
          </motion.div>
        </motion.div>

        {/* Floating Plus Signs with Parallax */}
        <motion.div style={{
        y: y1,
        scale: scale1
      }} className="absolute top-28 left-[18%] text-primary/25 text-5xl font-extralight select-none" animate={{
        rotate: [0, 180, 360],
        opacity: [0.2, 0.35, 0.2]
      }} transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear"
      }}>
          +
        </motion.div>
        <motion.div style={{
        y: y2
      }} className="absolute top-56 right-[22%] text-primary/20 text-6xl font-extralight select-none" animate={{
        rotate: [360, 180, 0],
        opacity: [0.15, 0.25, 0.15]
      }} transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}>
          +
        </motion.div>
        <motion.div style={{
        y: y3
      }} className="absolute bottom-72 left-[30%] text-primary/15 text-4xl font-extralight select-none" animate={{
        rotate: [0, -180, -360],
        opacity: [0.1, 0.2, 0.1]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }}>
          +
        </motion.div>
        <motion.div style={{
        y: y4
      }} className="absolute top-80 right-[30%] text-accent/40 text-5xl font-extralight select-none" animate={{
        rotate: [0, 90, 0],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          +
        </motion.div>

        {/* Floating Hearts with Parallax */}
        <motion.div style={{
        y: y2
      }} className="absolute top-1/3 left-[3%]" animate={{
        y: [0, -25, 0],
        scale: [1, 1.15, 1],
        rotate: [0, 10, 0]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <Heart className="w-10 h-10 text-red-300/40 fill-red-200/30" />
        </motion.div>
        <motion.div style={{
        y: y1
      }} className="absolute top-1/2 right-[3%]" animate={{
        y: [0, 20, 0],
        scale: [1, 1.2, 1],
        rotate: [0, -15, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}>
          <Heart className="w-12 h-12 text-primary/20 fill-primary/10" />
        </motion.div>
        <motion.div style={{
        y: y3
      }} className="absolute bottom-1/3 left-[12%]" animate={{
        y: [0, -15, 0],
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}>
          <Heart className="w-6 h-6 text-pink-300/30 fill-pink-200/20" />
        </motion.div>

        {/* Floating 3D Spheres */}
        <motion.div style={{
        y: y1
      }} className="absolute top-44 left-[28%]" animate={{
        y: [0, -20, 0],
        x: [0, 10, 0]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 shadow-lg shadow-primary/20" />
        </motion.div>
        <motion.div style={{
        y: y2
      }} className="absolute top-64 right-[28%]" animate={{
        y: [0, 15, 0],
        scale: [1, 1.3, 1]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1.5
      }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/60 to-accent/20 shadow-lg shadow-accent/30" />
        </motion.div>
        <motion.div style={{
        y: y3
      }} className="absolute bottom-80 left-[40%]" animate={{
        y: [0, -12, 0],
        x: [0, -8, 0]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.8
      }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary/50 to-transparent shadow-md" />
        </motion.div>
        <motion.div style={{
        y: y4
      }} className="absolute bottom-60 right-[35%]" animate={{
        y: [0, 18, 0],
        scale: [1, 1.4, 1]
      }} transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2.2
      }}>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400/40 to-orange-300/20 shadow-lg shadow-yellow-500/20" />
        </motion.div>

        {/* 3D Geometric Shapes */}
        <motion.div style={{
        y: y2
      }} className="absolute top-72 left-[6%] hidden lg:block" animate={{
        rotate: [0, 360],
        y: [0, -10, 0]
      }} transition={{
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}>
          <div className="w-16 h-16 border-2 border-primary/20 rounded-lg rotate-45" />
        </motion.div>
        <motion.div style={{
        y: y1
      }} className="absolute bottom-80 right-[5%] hidden lg:block" animate={{
        rotate: [0, -360],
        y: [0, 15, 0]
      }} transition={{
        rotate: {
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}>
          <div className="w-12 h-12 border-2 border-accent/30 rounded-full" />
          <div className="absolute inset-2 border border-accent/20 rounded-full" />
        </motion.div>

        {/* Ring Elements */}
        <motion.div style={{
        y: y3
      }} className="absolute top-96 right-[15%]" animate={{
        rotate: [0, 180, 0],
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <div className="w-20 h-20 rounded-full border-4 border-dashed border-primary/10" />
        </motion.div>
        
        {/* Gradient blobs */}
        <motion.div style={{
        y: y1
      }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <motion.div style={{
        y: y2
      }} className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/3 rounded-full blur-[180px]" />
      </div>

      <div className="container-main relative z-10 text-center max-w-5xl mx-auto px-4">
        {/* Badge */}
        <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.9
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} transition={{
        duration: 0.6,
        type: "spring"
      }} className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-12 px-4 py-2 shadow-lg shadow-primary/5">
          <motion.div animate={{
          rotate: [0, 360]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          {subtitle}
        </motion.div>

        {/* Main Heading - FROM DATABASE */}
        <motion.h1 initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7,
        delay: 0.1,
        type: "spring"
      }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-8 tracking-tight text-foreground">
          {title}
        </motion.h1>

        {/* Rotating Services Text */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.15
      }} className="text-xl md:text-2xl text-muted-foreground mb-8 h-10 flex items-center justify-center gap-2">
          <span>Specializing in</span>
          <span className="text-primary font-semibold relative inline-block min-w-[220px] text-left">
            <AnimatePresence mode="wait">
              <motion.span key={rotatingServices[currentServiceIndex]} initial={{
              opacity: 0,
              y: 20,
              rotateX: -90
            }} animate={{
              opacity: 1,
              y: 0,
              rotateX: 0
            }} exit={{
              opacity: 0,
              y: -20,
              rotateX: 90
            }} transition={{
              duration: 0.4,
              type: "spring"
            }} className="inline-block">
                {rotatingServices[currentServiceIndex]}
              </motion.span>
            </AnimatePresence>
            <motion.span className="inline-block w-[3px] h-[1.1em] bg-primary ml-1 align-middle rounded-full" animate={{
            opacity: [1, 0]
          }} transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }} />
          </span>
        </motion.div>

        {/* Description - FROM DATABASE */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="text-lg text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed md:text-lg">
          {content}
        </motion.p>

        {/* Search Bar with 3D effect */}
        <motion.div initial={{
        opacity: 0,
        y: 30,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} transition={{
        duration: 0.7,
        delay: 0.3,
        type: "spring"
      }} whileHover={{
        scale: 1.01,
        y: -2
      }} className="bg-background rounded-2xl shadow-2xl shadow-primary/10 border border-border/60 p-2.5 max-w-3xl mx-auto mb-20 transition-all duration-300">
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
                  {locations?.map(location => <SelectItem key={location.id} value={location.slug}>
                      {location.name}
                    </SelectItem>)}
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
            <Button onClick={handleSearch} className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* Stats Row with Hover Animations */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-[24px]">
          {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 15
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.5 + index * 0.1
          }} whileHover={{
            y: -8,
            scale: 1.05,
            transition: {
              duration: 0.3,
              type: "spring",
              stiffness: 300
            }
          }} className="group flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border/40 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/15 hover:border-primary/30 transition-all duration-300 cursor-default">
                <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 shadow-inner" whileHover={{
              rotate: [0, -10, 10, 0],
              transition: {
                duration: 0.5
              }
            }}>
                  <IconComponent className="w-7 h-7 text-primary" />
                </motion.div>
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              </motion.div>;
        })}
        </motion.div>
      </div>
    </section>;
}