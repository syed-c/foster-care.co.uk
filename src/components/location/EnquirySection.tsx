import { motion } from "framer-motion";
import { Phone, CheckCircle, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";

interface EnquirySectionProps {
  locationName: string;
  locationSlug: string;
  locationId?: string;
}

export const EnquirySection = ({ locationName, locationSlug, locationId }: EnquirySectionProps) => {
  const benefits = [
    { icon: CheckCircle, title: "No obligation", desc: "Free information, no commitment required" },
    { icon: Clock, title: "Quick response", desc: "Callback within 24 hours" },
    { icon: Shield, title: "Confidential", desc: "Your data is completely secure" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary to-secondary/95" id="enquire">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-5 rounded-full px-4 py-1.5">
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Get in Touch
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Start Your Fostering Journey in {locationName}
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Ready to learn more about fostering? Fill out our enquiry form and a dedicated fostering advisor will call you within 24 hours.
            </p>
            
            <div className="space-y-5">
              {benefits.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
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
