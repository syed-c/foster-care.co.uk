"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { 
  PoundSterling,
  Calculator,
  Gift,
  Home,
  Car,
  GraduationCap,
  Heart,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Info,
  Building2
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

export default function FosteringAllowancesGuide() {
  const allowanceTypes = [
    {
      title: "Basic Maintenance Allowance",
      description: "Covers the day-to-day costs of caring for a child including food, clothing, transport, and activities.",
      icon: Home,
      typical: "£450-650/week",
      notes: "Varies by age of child and local authority",
    },
    {
      title: "Skills-Based Fee",
      description: "A fee paid to foster carers in recognition of their skills, experience, and professional development.",
      icon: GraduationCap,
      typical: "£100-400/week",
      notes: "Higher for specialist fostering",
    },
    {
      title: "Holiday Allowance",
      description: "Additional funds to help cover costs of holidays and special outings with foster children.",
      icon: Gift,
      typical: "£200-500/year",
      notes: "Often paid as a lump sum",
    },
    {
      title: "Birthday & Celebration Allowance",
      description: "Funds for birthday presents, Christmas gifts, and celebration events.",
      icon: Gift,
      typical: "£100-250/occasion",
      notes: "Birthday and religious holidays",
    },
  ];

  const additionalSupport = [
    {
      title: "Mileage & Travel",
      description: "Reimbursement for travel to school, contact visits, and appointments",
    },
    {
      title: "Equipment Grants",
      description: "Funds for initial setup including bedroom furniture and essential equipment",
    },
    {
      title: "Training Expenses",
      description: "Costs covered for required training and professional development",
    },
    {
      title: "Respite Support",
      description: "Paid respite breaks to support foster carer wellbeing",
    },
    {
      title: "Legal Retainer",
      description: "Some agencies pay a retainer between placements",
    },
    {
      title: "Emergency Support",
      description: "24/7 support line and emergency financial assistance",
    },
  ];

  const taxInfo = [
    {
      title: "Tax-Free Threshold",
      description: "The first £10,000 per household is tax-free, plus £200/week per child under 11 or £250/week per child 11+.",
    },
    {
      title: "Qualifying Care Relief",
      description: "HMRC provides Qualifying Care Relief which means most foster carers pay little or no tax on their fostering income.",
    },
    {
      title: "Self-Employment",
      description: "Foster carers are self-employed and need to complete self-assessment tax returns, but the process is straightforward.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Fostering Allowances & Pay Guide | Foster Care UK"
        description="Understand foster carer allowances and pay in England. Learn about maintenance allowances, skill fees, additional support, and tax relief for foster carers."
        canonicalUrl="https://fostercare.uk/guides/fostering-allowances"
        keywords={["foster care allowance", "foster carer pay", "fostering income", "foster care fees"]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container-main py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Fostering Allowances</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
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
              className="max-w-4xl"
            >
              <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-0">
                <PoundSterling className="w-4 h-4 mr-2" />
                Financial Guide
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Fostering{" "}
                <span className="text-primary">Allowances & Pay</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                A comprehensive guide to foster carer allowances in England. 
                Understand what financial support is available and how it works.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/agencies">
                    Compare Agency Rates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#allowances">
                    <Calculator className="w-4 h-4 mr-2" />
                    View Allowances
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-8 bg-amber-50 border-y border-amber-200">
          <div className="container-main">
            <div className="flex items-start gap-4 max-w-4xl mx-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-800">Important Note</p>
                <p className="text-sm text-amber-700 mt-1">
                  Fostering allowances vary significantly between agencies and local authorities. 
                  The figures shown are typical ranges and should be used as a guide only. 
                  Always confirm exact rates with individual agencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Allowances */}
        <section id="allowances" className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Allowances</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Foster carers typically receive a combination of allowances designed to cover 
                the costs of caring for a child and recognise your skills and commitment.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {allowanceTypes.map((allowance, i) => {
                const Icon = allowance.icon;
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{allowance.title}</h3>
                            <p className="text-muted-foreground mb-4">{allowance.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                                <PoundSterling className="w-3 h-3 mr-1" />
                                {allowance.typical}
                              </Badge>
                              <Badge variant="secondary" className="bg-muted border-0 text-muted-foreground">
                                {allowance.notes}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Total Package Example */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Example Total Package</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Here's an example of what a typical foster carer might receive caring for one child aged 10:
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-border/50">
                      <span>Maintenance Allowance</span>
                      <span className="font-semibold">£550/week</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/50">
                      <span>Skills-Based Fee</span>
                      <span className="font-semibold">£200/week</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/50">
                      <span>Holiday Allowance (annualised)</span>
                      <span className="font-semibold">£8/week</span>
                    </div>
                    <div className="flex justify-between items-center py-4 bg-primary/10 rounded-xl px-4 -mx-4">
                      <span className="font-bold text-lg">Weekly Total</span>
                      <span className="font-bold text-2xl text-primary">£758/week</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    This is an illustrative example only. Actual payments vary by agency, placement type, and child's needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Additional Support */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Support</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Beyond regular allowances, foster carers often receive additional support and benefits.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {additionalSupport.map((item, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tax Information */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-0">
                <PoundSterling className="w-3 h-3 mr-2" />
                Tax Relief
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tax & Fostering Income</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Foster carers benefit from generous tax relief. Most foster carers pay little or no tax on their fostering income.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {taxInfo.map((item, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                        <PoundSterling className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Agency Packages</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Different agencies offer different support packages. Browse our directory to 
                find agencies and enquire about their specific allowances and benefits.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/agencies">
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Agencies
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/guides">
                    More Guides
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
