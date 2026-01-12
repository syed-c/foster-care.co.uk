import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsContentSection } from "@/hooks/useCmsContent";
import heroImage from "@/assets/hero-foster-family.jpg";

export function HeroSection() {
  const { data: heroContent } = useCmsContentSection("home", "hero");

  const title = heroContent?.title || "Finding the Right Foster Care Agency";
  const subtitle = heroContent?.subtitle || "UK Foster Care Directory";
  const content = heroContent?.content || "Connect with trusted foster care agencies across the United Kingdom. Every child deserves a loving home, and we're here to help you find the right support.";
  const ctaText = heroContent?.cta_text || "Find Agencies";
  const ctaUrl = heroContent?.cta_url || "/agencies";
  const imageUrl = heroContent?.image_url || heroImage;
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-warm via-background to-background-sand z-0" />
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative z-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6"
            >
              <Heart className="w-4 h-4" />
              {subtitle}
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight"
            >
              {title.includes("Foster Care") ? (
                <>
                  Finding the Right
                  <br />
                  <span className="text-primary relative">
                    Foster Care
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                      <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30"/>
                    </svg>
                  </span> Agency
                </>
              ) : title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground-muted mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {content}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to={ctaUrl}>
                <Button variant="hero" size="lg" className="w-full sm:w-auto group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <Search className="w-5 h-5" />
                  {ctaText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 pt-8 border-t border-border/50"
            >
              <div className="grid grid-cols-3 gap-6 text-white">
                {[
                  { icon: Shield, value: "500+", label: "Verified Agencies" },
                  { icon: Users, value: "4 Nations", label: "Across the UK" },
                  { icon: Heart, value: "Trusted", label: "By Social Workers" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                      <stat.icon className="w-4 h-4 text-primary" />
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={imageUrl}
                  alt="A caring foster family moment"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-5 shadow-elevated border border-border/50 max-w-[280px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ready to foster?</p>
                    <p className="text-sm text-muted-foreground">Start your journey today</p>
                  </div>
                </div>
                <Link to="/agencies">
                  <Button variant="secondary" size="sm" className="w-full text-white">
                    Find an Agency
                  </Button>
                </Link>
              </motion.div>
              
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-lg"
              >
                <p className="text-3xl font-bold">70K+</p>
                <p className="text-sm text-primary-foreground/80">Children need care</p>
              </motion.div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
