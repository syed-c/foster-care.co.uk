import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";
import { 
  Shield, CheckCircle, Search, BadgeCheck, Info, 
  ArrowRight, Star, Users, Building2, FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowListingsWork() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "How Listings Work", url: "/how-listings-work" },
  ];

  const steps = [
    {
      icon: Search,
      title: "We Find Agencies",
      description: "Our team identifies fostering agencies across England using public databases, Ofsted records, and Google Business Profile data.",
    },
    {
      icon: Building2,
      title: "Auto-Generated Profiles",
      description: "We create initial profiles using publicly available information. These are marked as 'Unclaimed' until verified.",
    },
    {
      icon: BadgeCheck,
      title: "Agency Claims & Verifies",
      description: "Agencies can claim their listing by verifying ownership through their Google Business Profile or official documentation.",
    },
    {
      icon: FileCheck,
      title: "Enhanced & Synced",
      description: "Verified agencies get enriched profiles with full details, priority placement, and ongoing data synchronization.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="How Our Listings Work | Foster Care Agency Directory"
        description="Learn how we create, verify, and maintain fostering agency listings in our directory. Understand the difference between claimed and unclaimed profiles."
        canonicalUrl="https://fostercare.uk/how-listings-work"
        structuredData={getBreadcrumbSchema(breadcrumbs)}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden gradient-hero">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-[10%] w-96 h-96 bg-trust/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-4 py-2 mb-6">
                <Shield className="w-4 h-4" />
                Transparency
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                How Our Listings Work
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                We believe in transparency. Here's exactly how we create, verify, and maintain agency profiles in our directory.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section-padding bg-background-warm">
          <div className="container-main">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-2xl md:text-3xl font-bold text-center mb-12"
              >
                Our 4-Step Process
              </motion.h2>

              <div className="space-y-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                        </div>
                        <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Profile Types */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold text-center mb-4"
            >
              Two Types of Profiles
            </motion.h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Our directory contains both auto-generated and verified agency profiles. Here's what each means.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Unclaimed Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-elevated p-8"
              >
                <div className="badge-unclaimed mb-4">
                  <Info className="w-4 h-4" />
                  Unclaimed Profile
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Auto-Generated Listings</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">Created from public sources (Ofsted, Google)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">Basic information only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">May have limited contact details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">Clearly marked as unclaimed</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  These profiles help us provide comprehensive coverage while agencies verify their listings.
                </p>
              </motion.div>

              {/* Verified Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="card-elevated p-8 border-2 border-verified/20"
              >
                <div className="badge-verified mb-4">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Agency
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Claimed & Verified Listings</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                    <span>Agency ownership confirmed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                    <span>Full contact details and information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                    <span>Regularly synced and updated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-verified mt-0.5" />
                    <span>Priority placement in searches</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Verified agencies have full control over their profile and receive enhanced visibility.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* For Agencies CTA */}
        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="container-main text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Are You a Fostering Agency?
              </h2>
              <p className="text-secondary-foreground/80 text-lg mb-8">
                Claim your listing today to take control of your profile, connect with potential foster carers, and showcase what makes your agency special.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-secondary hover:bg-white/90"
                  asChild
                >
                  <Link to="/claim">
                    Claim Your Listing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/register-agency">
                    Register New Agency
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="section-padding bg-background-sand">
          <div className="container-main text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Our Commitment to Accuracy
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                We regularly review and update our listings using official sources. If you notice any inaccuracies, please let us know so we can correct them promptly.
              </p>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to="/contact">
                  Report an Issue
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
