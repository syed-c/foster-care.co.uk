import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Heart, 
  FileText, 
  Home,
  GraduationCap,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Shield
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

export default function HowToBecomeGuide() {
  const steps = [
    {
      number: 1,
      title: "Initial Enquiry",
      description: "Contact a fostering agency to express your interest. They'll answer your initial questions and send you information about their services.",
      duration: "1-2 weeks",
      icon: MessageCircle,
    },
    {
      number: 2,
      title: "Information Session",
      description: "Attend an information session (online or in-person) to learn more about fostering, the agency, and what to expect.",
      duration: "1 session",
      icon: Users,
    },
    {
      number: 3,
      title: "Application Form",
      description: "Complete a detailed application form covering your background, experience, and motivations for fostering.",
      duration: "1-2 weeks",
      icon: FileText,
    },
    {
      number: 4,
      title: "Home Visit",
      description: "A social worker will visit your home to meet you, discuss fostering in detail, and assess your living situation.",
      duration: "2-4 weeks",
      icon: Home,
    },
    {
      number: 5,
      title: "Skills Training",
      description: "Complete pre-approval training covering child development, attachment, safeguarding, and managing challenging behaviour.",
      duration: "3-5 days",
      icon: GraduationCap,
    },
    {
      number: 6,
      title: "Assessment Process",
      description: "A comprehensive assessment including interviews, background checks, medical checks, and references from people who know you.",
      duration: "4-6 months",
      icon: Shield,
    },
    {
      number: 7,
      title: "Fostering Panel",
      description: "Your application is reviewed by an independent panel who will recommend whether to approve you as a foster carer.",
      duration: "1 day",
      icon: Users,
    },
    {
      number: 8,
      title: "Approval & Matching",
      description: "Once approved, you'll work with your agency to find a child or young person who would be a good match for your family.",
      duration: "Varies",
      icon: Heart,
    },
  ];

  const requirements = [
    {
      title: "Age",
      description: "You must be at least 21 years old. There's no upper age limit if you're fit and healthy.",
    },
    {
      title: "Living Space",
      description: "You need a spare bedroom for a foster child. Your home will be assessed for safety and suitability.",
    },
    {
      title: "Time & Availability",
      description: "At least one carer usually needs to be available full-time, especially for younger children.",
    },
    {
      title: "Background",
      description: "DBS checks are required. Some criminal convictions may not prevent you from fostering.",
    },
    {
      title: "Health",
      description: "You'll need a medical assessment. Having a disability doesn't automatically exclude you.",
    },
    {
      title: "Support Network",
      description: "Having a support network of family and friends is beneficial but not mandatory.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="How to Become a Foster Carer | Step-by-Step Guide | Foster Care UK"
        description="Learn how to become a foster carer in England. Our comprehensive guide covers the application process, requirements, training, and what to expect at each stage."
        canonicalUrl="https://fostercare.uk/guides/how-to-become-foster-carer"
        keywords={["become foster carer", "fostering application", "foster care training", "fostering requirements"]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container-main py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">How to Become a Foster Carer</span>
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
                <GraduationCap className="w-4 h-4 mr-2" />
                Complete Guide
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                How to Become a{" "}
                <span className="text-primary">Foster Carer</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                Everything you need to know about becoming a foster carer in England. 
                From your first enquiry to welcoming a child into your home.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/agencies">
                    Find an Agency
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#steps">
                    <Clock className="w-4 h-4 mr-2" />
                    View Process
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-background border-y border-border/50">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "4-6", label: "Months typical process" },
                { value: "21+", label: "Minimum age" },
                { value: "1", label: "Spare bedroom needed" },
                { value: "100%", label: "Training provided" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Basic Requirements</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Before you apply, here's what you'll need. Don't worry if you're unsure about any of these – 
                agencies are happy to discuss your individual circumstances.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {requirements.map((req, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{req.title}</h3>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section id="steps" className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-0">
                <Clock className="w-3 h-3 mr-2" />
                The Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Fostering Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here's what to expect at each stage of your fostering journey. 
                The entire process typically takes 4-6 months.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-12 pb-12 last:pb-0"
                  >
                    {/* Timeline line */}
                    {i < steps.length - 1 && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10" />
                    )}
                    
                    {/* Step number circle */}
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30">
                      {step.number}
                    </div>

                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold">{step.title}</h3>
                              <Badge variant="secondary" className="w-fit text-xs bg-muted border-0">
                                <Clock className="w-3 h-3 mr-1" />
                                {step.duration}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-0 bg-gradient-to-br from-background to-background-warm shadow-xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Tips for Your Application</h2>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Be honest</strong> – Agencies appreciate openness about your life experiences and circumstances.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Ask questions</strong> – There are no silly questions. The more you understand, the better prepared you'll be.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Involve your household</strong> – Everyone in your home will be part of the assessment process.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span><strong>Compare agencies</strong> – Talk to several agencies to find the best fit for your family.</span>
                        </li>
                      </ul>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the First Step?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Find a foster care agency near you and start your fostering journey today. 
                Our directory makes it easy to compare agencies and their support packages.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/agencies">
                    Find an Agency
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/guides">
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
