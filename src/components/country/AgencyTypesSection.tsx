import { motion } from 'framer-motion';
import { Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

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
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {heading || "Independent vs Local Authority Agencies"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {intro || "Learn about the different types of fostering agencies and their unique benefits."}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Independent Agencies Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-primary/8 via-primary/3 to-transparent rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-primary/15 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                >
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Independent Agencies</h3>
                  <p className="text-muted-foreground text-sm">Private organizations</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                {independent?.description || "Independent fostering agencies offer personalized support and flexible approaches to fostering."}
              </p>

              <ul className="space-y-3 mb-8">
                {(independent?.benefits || defaultIndependentBenefits).map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <Link to="/agencies?type=independent">
                <Button className="w-full sm:w-auto group/btn">
                  Explore Independent
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
            whileHover={{ y: -6 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-accent/40 via-accent/20 to-transparent rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                >
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Local Authority</h3>
                  <p className="text-muted-foreground text-sm">Government agencies</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                {local_authority?.description || "Local authority fostering services provide structured support and integration with public services."}
              </p>

              <ul className="space-y-3 mb-8">
                {(local_authority?.benefits || defaultLocalAuthorityBenefits).map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <Link to="/agencies?type=local-authority">
                <Button variant="outline" className="w-full sm:w-auto group/btn">
                  Explore Local Authority
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};