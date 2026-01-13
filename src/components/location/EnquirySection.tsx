import { motion } from "framer-motion";
import { Phone, CheckCircle, Shield, Clock, Heart } from "lucide-react";
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
    <section className="py-10 md:py-14 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden" id="enquire">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
      </div>
      
      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/40 mb-4 rounded-full px-3 py-1 font-bold text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
              Start Your Journey in {locationName}
            </h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Fill out our enquiry form and a fostering advisor will call you within 24 hours.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <p className="text-white/40 text-[10px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/10"
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