import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsContentSection } from "@/hooks/useCmsContent";

const agencyBenefits = [
  "Reach thousands of prospective foster carers",
  "Manage your agency profile and reviews",
  "Receive qualified leads directly",
];

const socialWorkerBenefits = [
  "Search verified agencies across the UK",
  "Filter by specialization and availability",
  "Find the right match for each child",
];

export function AgencyCTASection() {
  const { data: agencyContent } = useCmsContentSection("home", "agency_cta");

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-gradient-to-l from-accent/30 to-transparent rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-4">
            <Building2 className="w-4 h-4" />
            For Professionals
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {agencyContent?.title || "Join Our Growing Network"}
          </h2>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            {agencyContent?.content || "Whether you're a fostering agency or social worker, we're here to help you connect with the right people."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* For Agencies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-full bg-gradient-to-br from-primary/5 via-background-warm to-background rounded-3xl p-8 border border-primary/10 hover:border-primary/20 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Are You a Foster Care Agency?</h3>
                  <p className="text-muted-foreground text-sm">Claim your profile today</p>
                </div>
              </div>
              
              <p className="text-foreground-muted mb-6 leading-relaxed">
                Join hundreds of agencies already using our directory to reach families 
                who are ready to make a difference.
              </p>

              <ul className="space-y-3 mb-8">
                {agencyBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/claim">
                <Button variant="secondary" className="w-full sm:w-auto group/btn text-white">
                  Claim Your Agency
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* For Social Workers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="h-full bg-gradient-to-br from-accent/30 via-background to-background-warm rounded-3xl p-8 border border-border hover:border-primary/20 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">For Social Workers</h3>
                  <p className="text-muted-foreground text-sm">Find the right placements</p>
                </div>
              </div>
              
              <p className="text-foreground-muted mb-6 leading-relaxed">
                Access our comprehensive database of verified foster care agencies. 
                Filter by location, specialization, and availability.
              </p>

              <ul className="space-y-3 mb-8">
                {socialWorkerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/agencies">
                <Button variant="secondary" className="w-full sm:w-auto group/btn">
                  Search Directory
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
