import { motion } from 'framer-motion';
import { Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

  // Default benefits for each type
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
    <div className="w-full">
      <div className="text-center max-w-[720px] mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {heading || "Independent vs Local Authority Agencies"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground-muted text-lg max-w-[720px] mx-auto"
        >
          {intro || "Learn about the different types of fostering agencies and their unique benefits."}
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
        {/* Independent Agencies Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-full bg-gradient-to-br from-primary/5 via-background-warm to-background rounded-3xl p-8 border border-primary/10 hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Independent Agencies</h3>
                <p className="text-muted-foreground text-sm">Private organizations</p>
              </div>
            </div>
            
            <p className="text-foreground-muted mb-6 leading-relaxed">
              {independent?.description || "Independent fostering agencies offer personalized support and flexible approaches to fostering."}
            </p>

            <ul className="space-y-3 mb-8">
              {(independent?.benefits || defaultIndependentBenefits).map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link to="/agencies">
              <Button variant="secondary" className="w-full sm:w-auto group/btn text-white">
                Explore Independent
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Local Authority Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="h-full bg-gradient-to-br from-accent/30 via-background to-background-warm rounded-3xl p-8 border border-border hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Local Authority</h3>
                <p className="text-muted-foreground text-sm">Government agencies</p>
              </div>
            </div>
            
            <p className="text-foreground-muted mb-6 leading-relaxed">
              {local_authority?.description || "Local authority fostering services provide structured support and integration with public services."}
            </p>

            <ul className="space-y-3 mb-8">
              {(local_authority?.benefits || defaultLocalAuthorityBenefits).map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link to="/agencies">
              <Button variant="secondary" className="w-full sm:w-auto group/btn">
                Explore Local Authority
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};