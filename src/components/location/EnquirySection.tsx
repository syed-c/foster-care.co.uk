import { motion } from "framer-motion";
import { Phone, CheckCircle, Shield, Clock, Heart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";

interface EnquirySectionProps {
  locationName: string;
  locationSlug: string;
  locationId?: string;
}

export const EnquirySection = ({ locationName, locationSlug, locationId }: EnquirySectionProps) => {
  const benefits = [
    { icon: CheckCircle, title: "No obligation", desc: "Free information, no commitment" },
    { icon: Clock, title: "Quick response", desc: "Callback within 24 hours" },
    { icon: Shield, title: "Confidential", desc: "Your data is secure" },
    { icon: Heart, title: "Personal support", desc: "Dedicated advisor" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden" id="enquire">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-warm/10 rounded-full blur-[180px]" />
        
        {/* Floating icons */}
        <motion.div 
          className="absolute top-32 right-[20%] hidden lg:block"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Phone className="w-6 h-6 text-primary" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-[15%] hidden lg:block"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Sparkles className="w-8 h-8 text-warm/40" />
        </motion.div>
      </div>
      
      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/40 mb-5 rounded-full px-4 py-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Get in Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
              Start Your Fostering Journey in {locationName}
            </h2>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              Ready to learn more about fostering? Fill out our enquiry form and a dedicated fostering advisor will call you within 24 hours.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/20"
          >
            <MultiStepLeadForm 
              sourceType={`location_${locationSlug}`} 
              sourceLocationId={locationId} 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};