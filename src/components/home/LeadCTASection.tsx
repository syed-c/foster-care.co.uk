import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, CheckCircle, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsContentSection } from "@/hooks/useCmsContent";

const benefits = [
  { icon: CheckCircle, text: "No obligation consultation" },
  { icon: Phone, text: "Response within 24 hours" },
  { icon: Shield, text: "100% confidential" },
];

export function LeadCTASection() {
  const { data: ctaContent } = useCmsContentSection("home", "lead_cta");

  return (
    <section className="section-padding bg-background-sand relative overflow-hidden">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6"
                >
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-background leading-tight"
                >
                  {ctaContent?.title || (
                    <>
                      Ready to Take the
                      <br />
                      <span className="text-primary">First Step?</span>
                    </>
                  )}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-background/70 text-lg md:text-xl mb-8 max-w-lg"
                >
                  {ctaContent?.content || "Whether you're considering fostering or looking for the right agency, we're here to help guide you through the process."}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/contact">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full sm:w-auto group shadow-lg shadow-primary/30"
                    >
                      Get Support
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/agencies">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full sm:w-auto text-white"
                    >
                      Browse Agencies
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 bg-background/5 backdrop-blur-sm rounded-2xl p-5 border border-background/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-background">{benefit.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
