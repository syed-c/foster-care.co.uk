"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Building2, 
  RefreshCw, 
  Lock, 
  Eye,
  ArrowRight,
  BadgeCheck,
  FileText,
  Users,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrustVerification() {
  const verificationFeatures = [
    {
      icon: BadgeCheck,
      title: "Identity Verification",
      description: "Agency representatives verify their identity through secure authentication with their Google Business Profile.",
    },
    {
      icon: RefreshCw,
      title: "Live Data Sync",
      description: "Information is kept up-to-date through regular synchronization with verified business data.",
    },
    {
      icon: FileText,
      title: "Extended Details",
      description: "Verified profiles include comprehensive information about services, specialisms, and support offered.",
    },
    {
      icon: Star,
      title: "Review Management",
      description: "Verified agencies can respond to reviews and showcase their commitment to quality care.",
    },
  ];

  const comparisonData = [
    {
      feature: "Profile Status",
      unclaimed: "Auto-generated",
      verified: "Verified & Managed",
    },
    {
      feature: "Data Source",
      unclaimed: "Public information only",
      verified: "Directly from agency",
    },
    {
      feature: "Contact Details",
      unclaimed: "Limited availability",
      verified: "Full contact information",
    },
    {
      feature: "Description",
      unclaimed: "Basic overview",
      verified: "Comprehensive details",
    },
    {
      feature: "Specialisms",
      unclaimed: "May be incomplete",
      verified: "Complete & verified",
    },
    {
      feature: "Updates",
      unclaimed: "Periodic sync",
      verified: "Real-time updates",
    },
    {
      feature: "Response to Reviews",
      unclaimed: "Not available",
      verified: "Full access",
    },
    {
      feature: "Priority Listing",
      unclaimed: "Standard placement",
      verified: "Featured placement",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Trust & Verification | Foster Care UK"
        description="Understand how Foster Care UK verifies agencies and maintains accurate, trustworthy information. Learn the difference between unclaimed and verified profiles."
        canonicalUrl="https://fostercare.uk/trust-verification"
        keywords={["verified agencies", "foster care trust", "agency verification", "profile verification"]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background-warm to-background-sand" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/30 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-0">
                <Shield className="w-4 h-4 mr-2" />
                Trust & Transparency
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                How We Verify{" "}
                <span className="text-primary">Foster Care Agencies</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We believe in transparency. Learn how we build and maintain accurate agency profiles, 
                and understand the difference between unclaimed and verified listings.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two Profile Types */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Two Types of Profiles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every agency on our platform falls into one of two categories. Both are valuable, 
                but verified profiles offer more comprehensive information.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Unclaimed Profile Card */}
              <motion.div variants={itemVariants}>
                <Card className="h-full border-2 border-border/50 hover:border-amber-500/30 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0 mb-2">
                          Unclaimed
                        </Badge>
                        <CardTitle className="text-xl">Auto-Generated Profile</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      These profiles are created using publicly available information to help families 
                      discover agencies in their area. They provide a starting point for research.
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground/80">What's included:</h4>
                      <ul className="space-y-2 text-sm">
                        {[
                          "Basic agency name and location",
                          "General service area",
                          "Public contact information (if available)",
                          "General fostering categories",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground italic">
                        "This profile was auto-generated using publicly available information. 
                        Details may be limited until the agency claims and verifies their listing."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Verified Profile Card */}
              <motion.div variants={itemVariants}>
                <Card className="h-full border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                        <BadgeCheck className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-0 mb-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                        <CardTitle className="text-xl">Claimed & Verified Profile</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <p className="text-muted-foreground">
                      Verified profiles are managed directly by the agency. They provide comprehensive, 
                      up-to-date information and are prioritized in search results.
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground/80">What's included:</h4>
                      <ul className="space-y-2 text-sm">
                        {[
                          "Complete agency description and history",
                          "Full contact details and team information",
                          "Detailed specialisms and services",
                          "Support packages for foster carers",
                          "Response to reviews and enquiries",
                          "Featured placement in listings",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        ✓ Verified agency profile • Data synced and accurate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Side-by-Side Comparison</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See exactly what information is available on each type of profile.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            Unclaimed
                          </div>
                        </th>
                        <th className="text-center p-4 font-semibold bg-primary/5">
                          <div className="flex items-center justify-center gap-2">
                            <BadgeCheck className="w-4 h-4 text-primary" />
                            Verified
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, i) => (
                        <tr key={i} className="border-t border-border/50">
                          <td className="p-4 font-medium">{row.feature}</td>
                          <td className="p-4 text-center text-muted-foreground text-sm">{row.unclaimed}</td>
                          <td className="p-4 text-center text-sm bg-primary/5 text-primary font-medium">{row.verified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-0">
                <Lock className="w-3 h-3 mr-2" />
                Verification Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Verification Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our verification process ensures only legitimate agencies can claim and manage their profiles.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {verificationFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="pt-8 pb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-0 bg-gradient-to-br from-background to-background-warm shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment to Accuracy</h2>
                      <div className="prose prose-lg text-muted-foreground">
                        <p>
                          We take accuracy seriously. Our team regularly reviews profiles to ensure information 
                          remains current and helpful. We never invent or assume details about agencies.
                        </p>
                        <p className="mt-4">
                          For unclaimed profiles, we clearly indicate that information may be limited. 
                          We encourage all agencies to claim their profiles to provide the most accurate 
                          and comprehensive information to prospective foster carers.
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-8">
                        <Button asChild>
                          <Link href="/claim">
                            <Building2 className="w-4 h-4 mr-2" />
                            Claim Your Agency
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/editorial-policy">
                            <FileText className="w-4 h-4 mr-2" />
                            Editorial Policy
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-main text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Agency?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Browse our directory of foster care agencies across England. 
                Filter by location, specialism, and verification status.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/agencies">
                    Browse Agencies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/how-listings-work">
                    How Listings Work
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
