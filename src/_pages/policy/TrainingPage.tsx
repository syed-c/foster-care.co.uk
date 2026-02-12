"use client";

import { motion } from "framer-motion";
import {
    GraduationCap,
    ArrowRight,
    BookOpen,
    Users,
    Award,
    BadgeCheck,
    CheckCircle,
    Video,
    LayoutDashboard,
    Download,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function TrainingPage() {
    const trainingFeatures = [
        {
            icon: BookOpen,
            title: "Pre-Approval Training",
            desc: "The 'Skills to Foster' course prepares you for the initial challenges and rewards of fostering before you are approved.",
        },
        {
            icon: LayoutDashboard,
            title: "Ongoing Development",
            desc: "Continuous professional development through workshops, webinars, and specialist therapeutic training modules.",
        },
        {
            icon: Award,
            title: "Accredited Courses",
            desc: "Gain recognized qualifications in child care and development as you progress through your fostering career.",
        }
    ];

    const trainingStages = [
        {
            title: "Stage 1: Skills to Foster",
            items: [
                "Understanding the role of a foster carer",
                "Attachment and child development basics",
                "Safeguarding and risk management",
                "Working with biological families"
            ]
        },
        {
            title: "Stage 2: Post-Approval (Year 1)",
            items: [
                "The Training, Support and Development (TSD) standards",
                "Managing difficult behaviors",
                "First aid for children and infants",
                "Record keeping and professional reporting"
            ]
        },
        {
            title: "Stage 3: Specialist Training",
            items: [
                "Therapeutic care and trauma-informed practice",
                "Supporting children with disabilities",
                "Parent & Child specialist workshops",
                "Caring for teenagers and independence prep"
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <SEOHead
                title="Foster Carer Training & Professional Development | Foster Care UK"
                description="Explore our comprehensive training programs for foster carers, from pre-approval 'Skills to Foster' courses to ongoing therapeutic training."
                canonicalUrl="https://www.foster-care.co.uk/policy/training"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Training & Development", url: "https://www.foster-care.co.uk/policy/training" },
                ])}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <GraduationCap className="w-3.5 h-3.5 mr-2 inline" />
                                    Empowering Your Success
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95]">
                                    Fostering <span className="text-primary italic">Training</span>
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                    You are never alone in your learning. From day one, we provide the tools, knowledge, and support to help you become an expert carer.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-primary/20" asChild>
                                        <Link href="/become-a-foster">
                                            Start Training
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="#curriculum">
                                            View Curriculum
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Training Pillars */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {trainingFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm transition-all duration-300 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{feature.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stages/Curriculum */}
                <section id="curriculum" className="py-20 md:py-32 bg-background-sand overflow-hidden">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                    <div className="w-10 h-px bg-primary" />
                                    Your Growth
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    A Journey of <br /><span className="text-primary italic">Continuous Learning</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
                                    Our training pathway is designed to support you at every stage, from your very first enquiry to caring for children with complex needs.
                                </p>

                                <div className="space-y-6">
                                    {trainingStages.map((stage, i) => (
                                        <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                                            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-2">
                                                <BadgeCheck className="w-6 h-6 text-primary" />
                                                {stage.title}
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {stage.items.map((item, j) => (
                                                    <div key={j} className="flex items-start gap-2 text-slate-500 font-medium text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                    <img
                                        src="/images/training-hero.jpg"
                                        alt="Carer attending a workshop"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workshops/Download */}
                <section className="py-20 md:py-32 bg-slate-900 text-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                                    <Video className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Digital Workshop Hub</h2>
                                <p className="text-lg text-white/70 font-medium mb-8">
                                    Access our library of recorded webinars, specialist guest lectures, and bite-sized training videos anytime, anywhere.
                                </p>
                                <Button className="rounded-full h-14 px-8 font-black bg-primary hover:bg-primary/90">
                                    Access Training Portal
                                </Button>
                            </div>
                            <div className="bg-slate-800/50 p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8">
                                    <Download className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Training Prospectus</h3>
                                <p className="text-white/60 mb-8 font-medium">
                                    Download our full 2026 training guide to see the complete list of mandatory and optional courses.
                                </p>
                                <Button variant="outline" className="rounded-full h-14 px-8 border-white/20 text-white font-bold hover:bg-white/10">
                                    Download PDF Guide
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <CTASection locationName="the UK" />
            </main>

            <Footer />
        </div>
    );
}
