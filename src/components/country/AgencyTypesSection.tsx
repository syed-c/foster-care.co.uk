import { motion } from 'framer-motion';
import { Building2, Users, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface AgencyType {
  title: string;
  description: string;
  benefits?: string[];
}

interface AgencyTypesSectionProps {
  heading?: string;
  intro?: string;
  independent?: AgencyType;
  local_authority?: AgencyType;
}

export const AgencyTypesSection = ({ 
  heading, 
  intro, 
  independent, 
  local_authority 
}: AgencyTypesSectionProps) => {
  if (!independent && !local_authority) return null;

  const defaultIndependentBenefits = [
    "Complete autonomy in decision making",
    "Flexible policies tailored to your needs", 
    "Direct communication with management",
    "Specialized support services"
  ];

  const defaultLocalAuthorityBenefits = [
    "Government backing and oversight",
    "Standardized processes and training",
    "Integrated with local services",
    "Public funding and resources"
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[250px] bg-verified/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="bg-verified/20 text-verified border-verified/40 rounded-full px-4 py-1.5 font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Agency Types
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {heading || "Independent vs Local Authority Agencies"}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {intro || "Learn about the different types of fostering agencies and their unique benefits."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Independent Agencies Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-primary/10 via-slate-800/80 to-slate-800/50 rounded-2xl p-6 md:p-8 border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Independent Agencies</h3>
                  <p className="text-white/50 text-sm">Private organizations</p>
                </div>
              </div>
              
              <p className="text-white/60 mb-6 leading-relaxed">
                {independent?.description || "Independent fostering agencies offer personalized support and flexible approaches to fostering."}
              </p>

              <ul className="space-y-3 mb-8">
                {(independent?.benefits || defaultIndependentBenefits).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/agencies?type=independent">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold">
                  Explore Independent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Local Authority Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-trust/10 via-slate-800/80 to-slate-800/50 rounded-2xl p-6 md:p-8 border border-trust/20 hover:border-trust/40 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-trust/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-trust" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Local Authority</h3>
                  <p className="text-white/50 text-sm">Government agencies</p>
                </div>
              </div>
              
              <p className="text-white/60 mb-6 leading-relaxed">
                {local_authority?.description || "Local authority fostering services provide structured support and integration with public services."}
              </p>

              <ul className="space-y-3 mb-8">
                {(local_authority?.benefits || defaultLocalAuthorityBenefits).map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-trust flex-shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/agencies?type=local-authority">
                <Button variant="outline" className="w-full border-trust/50 bg-trust/10 text-trust hover:bg-trust hover:text-white rounded-xl font-bold">
                  Explore Local Authority
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
