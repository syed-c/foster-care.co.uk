"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

import { BackToTop } from "@/components/shared/BackToTop";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  Heart,
  Home,
  Baby,
  Shield,
  AlertTriangle,
  HandHeart,
  UserPlus,
  ArrowRight,
  ChevronRight,
  CheckCircle,
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

export default function TypesOfFosteringGuide() {
  const fosteringTypes = [
    {
      title: "Short-Term Fostering",
      description: "Providing temporary care while a child's future is being decided. This could be days, weeks, or months.",
      icon: Clock,
      duration: "Days to months",
      suitable: ["Flexible schedules", "Those new to fostering", "Active families"],
      color: "from-blue-500/20 to-blue-500/5",
      textColor: "text-blue-600",
    },
    {
      title: "Long-Term Fostering",
      description: "A permanent family placement where a child lives with you until they're ready for independence, often into adulthood.",
      icon: Home,
      duration: "Years",
      suitable: ["Committed families", "Those seeking lasting relationships", "Experienced carers"],
      color: "from-green-500/20 to-green-500/5",
      textColor: "text-green-600",
    },
    {
      title: "Emergency Fostering",
      description: "Immediate, short-notice placements when children need to leave their home urgently, often at unsociable hours.",
      icon: AlertTriangle,
      duration: "Hours to weeks",
      suitable: ["Flexible availability", "Calm under pressure", "Always-ready homes"],
      color: "from-red-500/20 to-red-500/5",
      textColor: "text-red-600",
    },
    {
      title: "Respite Fostering",
      description: "Providing short breaks for other foster families or birth families who need temporary support.",
      icon: HandHeart,
      duration: "Weekends or weeks",
      suitable: ["Part-time availability", "Working carers", "Those new to fostering"],
      color: "from-purple-500/20 to-purple-500/5",
      textColor: "text-purple-600",
    },
    {
      title: "Parent & Child Fostering",
      description: "Supporting a parent (often young mums) alongside their baby to develop parenting skills in a safe environment.",
      icon: Baby,
      duration: "Weeks to months",
      suitable: ["Experience with babies", "Mentoring skills", "Patient carers"],
      color: "from-pink-500/20 to-pink-500/5",
      textColor: "text-pink-600",
    },
    {
      title: "Specialist/Therapeutic Fostering",
      description: "Supporting children with complex needs, trauma histories, or challenging behaviours with enhanced support.",
      icon: Shield,
      duration: "Varies",
      suitable: ["Experienced carers", "Therapeutic training", "High support tolerance"],
      color: "from-amber-500/20 to-amber-500/5",
      textColor: "text-amber-600",
    },
    {
      title: "Sibling Group Fostering",
      description: "Keeping brothers and sisters together by fostering two or more children from the same family.",
      icon: Users,
      duration: "Varies",
      suitable: ["Larger homes", "Experience with multiple children", "Families with children"],
      color: "from-teal-500/20 to-teal-500/5",
      textColor: "text-teal-600",
    },
    {
      title: "Staying Put",
      description: "Allowing young people to remain with their foster family after turning 18 while they transition to independence.",
      icon: UserPlus,
      duration: "18-25 years old",
      suitable: ["Long-term carers", "Mentors", "Supporting young adults"],
      color: "from-indigo-500/20 to-indigo-500/5",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Types of Fostering | Complete Guide | Foster Care UK"
        description="Explore different types of fostering in England: short-term, long-term, emergency, respite, parent & child, and specialist fostering. Find the right fit for you."
        canonicalUrl="https://www.foster-care.co.uk/guides/types-of-fostering"
        keywords={["types of fostering", "short term fostering", "emergency fostering", "respite care", "specialist fostering"]}
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
              <span className="text-foreground font-medium">Types of Fostering</span>
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
                <Heart className="w-4 h-4 mr-2" />
                Fostering Options
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Types of{" "}
                <span className="text-primary">Fostering</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                There are many ways to foster. Discover the different types and find
                the right fit for your lifestyle, skills, and family situation.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/specialisms">
                    Browse Specialisms
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#types">
                    <Users className="w-4 h-4 mr-2" />
                    View All Types
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-12 bg-background border-y border-border/50">
          <div className="container-main">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every child in care has unique needs, which is why fostering comes in many forms.
                Some carers specialise in one type, while others offer multiple types of care.
                The right choice depends on your circumstances, experience, and what you want to offer.
              </p>
            </div>
          </div>
        </section>

        {/* Types Grid */}
        <section id="types" className="section-padding bg-muted/30">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">All Types of Fostering</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore each type to understand what's involved and who it might suit.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              {fosteringTypes.map((type, i) => {
                const Icon = type.icon;
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-8 h-8 ${type.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold">{type.title}</h3>
                              <Badge variant="secondary" className="text-xs bg-muted border-0">
                                <Clock className="w-3 h-3 mr-1" />
                                {type.duration}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{type.description}</p>

                            <div>
                              <p className="text-sm font-medium text-foreground/80 mb-2">Best suited for:</p>
                              <div className="flex flex-wrap gap-2">
                                {type.suitable.map((item, j) => (
                                  <Badge key={j} variant="secondary" className="text-xs bg-background border border-border/50">
                                    <CheckCircle className="w-3 h-3 mr-1 text-primary" />
                                    {item}
                                  </Badge>
                                ))}
                              </div>
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

        {/* Choosing the Right Type */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-0 bg-gradient-to-br from-background to-background-warm shadow-xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">How to Choose</h2>

                  <div className="space-y-6 text-muted-foreground">
                    <p>
                      There's no "wrong" choice when it comes to fostering types. The best fit depends on:
                    </p>

                    <ul className="space-y-3">
                      {[
                        "Your daily schedule and work commitments",
                        "The space you have in your home",
                        "Your previous experience with children",
                        "Your patience and emotional resilience",
                        "Whether you have your own children",
                        "Your support network and backup plans",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p>
                      Many foster carers start with one type and evolve as they gain experience.
                      Your fostering agency will help you identify the best fit during the assessment process.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button asChild>
                      <Link href="/agencies">
                        <Building2 className="w-4 h-4 mr-2" />
                        Find an Agency
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/specialisms">
                        Browse Specialisms
                      </Link>
                    </Button>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Fostering?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Connect with fostering agencies that specialise in the type of care you're interested in.
                Many offer all types, so you can discuss options with them directly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/agencies">
                    Browse Agencies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/guides/how-to-become-foster-carer">
                    How to Apply
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>


      <BackToTop />
    </div>
  );
}
