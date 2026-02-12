"use client";

import { motion } from "framer-motion";
import {
    Home,
    ArrowRight,
    Clock,
    ShieldCheck,
    Users,
    Heart,
    Sparkles,
    Baby,
    Network,
    SearchCheck,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function PlacementPage() {
    const placementTypes = [
        {
            icon: Clock,
            title: "Short-Term",
            desc: "Providing stability while long-term plans are finalized. This can last from a few days to several months.",
            color: "from-blue-500/10 to-blue-600/5 border-blue-100"
        },
        {
            icon: Home,
            title: "Long-Term",
            desc: "Children become a permanent part of your family until they reach adulthood and independence.",
            color: "from-rose-500/10 to-rose-600/5 border-rose-100"
        },
        {
            icon: ShieldCheck,
            title: "Emergency",
            desc: "Immediate care for children who need a safe place within hours, often due to unforeseen circumstances.",
            color: "from-amber-500/10 to-amber-600/5 border-amber-100"
        },
        {
            icon: Baby,
            title: "Parent & Child",
            desc: "A specialized placement where you support a parent and their infant together to help them stay as a family.",
            color: "from-violet-500/10 to-violet-600/5 border-violet-100"
        },
        {
            icon: Users,
            title: "Respite Care",
            desc: "Short-term breaks (usually weekends) to support other foster families or special guardianship carers.",
            color: "from-teal-500/10 to-teal-600/5 border-teal-100"
        },
        {
            icon: Briefcase,
            title: "Therapeutic",
            desc: "Care for children with complex emotional or behavioral needs who require specialist support frameworks.",
            color: "from-emerald-500/10 to-emerald-600/5 border-emerald-100"
        }
    ];

    const matchingLogic = [
        {
            step: "1",
            title: "Needs Assessment",
            desc: "We analyze the child's specific background, health, and education needs."
        },
        {
            step: "2",
            title: "Carer Profiling",
            desc: "We look at your family's dynamic, experience, and available space."
        },
        {
            step: "3",
            title: "Matching Panel",
            desc: "Social workers work together to ensure the best cultural and emotional fit."
        },
        {
            step: "4",
            title: "Introduction",
            desc: "Carefully planned introductions allow you and the child to get to know each other."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <SEOHead
                title="Types of Foster Care Placements & Matching | Foster Care UK"
                description="Learn about the different types of foster care placements, including short-term, long-term, and emergency care. Understand the matching process."
                canonicalUrl="https://www.foster-care.co.uk/policy/placement"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Placements & Matching", url: "https://www.foster-care.co.uk/policy/placement" },
                ])}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <Network className="w-3.5 h-3.5 mr-2 inline" />
                                    Finding the Perfect Fit
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95]">
                                    Placement <span className="text-primary italic">Types</span>
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                    Every child is unique, and so is every home. Explore the different ways you can provide care and how we ensure a perfect match.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-primary/20" asChild>
                                        <Link href="/become-a-foster">
                                            Start Your Journey
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="/contact">
                                            Talk About Matching
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Placement Options Grid */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-slate-950">Ways You Can Care</h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                Different fostering types require different levels of commitment. We'll help you find the one that fits your life and skills.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {placementTypes.map((type, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${type.color} border transition-all duration-300 group`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-50 group-hover:scale-110 transition-transform">
                                        <type.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{type.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed mb-6">{type.desc}</p>
                                    <div className="pt-4 border-t border-slate-200/50">
                                        <Link href="/contact" className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                            Enquire About This <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Matching Process */}
                <section className="py-20 md:py-32 bg-background-sand overflow-hidden">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                    <SearchCheck className="w-4 h-4" />
                                    The Science of Matching
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    How We <span className="text-primary italic">Match You</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 font-medium">
                                    Successful fostering depends on a stable, compatible match. Our rigorous process ensures that both the carer and the child feel comfortable and safe.
                                </p>

                                <div className="space-y-6">
                                    {matchingLogic.map((item, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shrink-0">
                                                {item.step}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-950 mb-1">{item.title}</h3>
                                                <p className="text-slate-600 font-medium text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                    <img
                                        src="/images/matching-hero.jpg"
                                        alt="Child smiling with foster parent"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544333346-60195e263d6f?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50" />
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
