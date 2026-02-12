"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    ArrowRight,
    Lock,
    Eye,
    UserCheck,
    FileCheck,
    AlertCircle,
    PhoneCall,
    Search,
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function SafeguardingPage() {
    const safeguardingPillars = [
        {
            icon: Search,
            title: "Rigorous Vetting",
            desc: "Enhanced DBS checks, local authority audits, and comprehensive personal references are standard for all carers.",
        },
        {
            icon: ShieldAlert,
            title: "Safe Home Audits",
            desc: "Regular health and safety inspections ensures your home remains a secure environment for vulnerable children.",
        },
        {
            icon: Eye,
            title: "Active Monitoring",
            desc: "Supervising social workers provide ongoing oversight, ensuring standards of care never falter.",
        }
    ];

    const vettingSteps = [
        {
            title: "Enhanced DBS Check",
            desc: "A thorough criminal record check for everyone in the household over the age of 18."
        },
        {
            title: "Home Safety Review",
            desc: "An audit of fire safety, security, and environmental hazards in your property."
        },
        {
            title: "Health Assessment",
            desc: "A medical report from your GP to ensure you have the physical and mental health to foster."
        },
        {
            title: "Personal References",
            desc: "Interviews with people who have known you for years, including past partners and employers."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <SEOHead
                title="Safeguarding & Vetting Policy | Foster Care UK"
                description="Learn about our rigorous safeguarding and vetting processes for foster carers, including DBS checks, home safety audits, and continuous monitoring."
                canonicalUrl="https://www.foster-care.co.uk/policy/safeguarding"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Safeguarding", url: "https://www.foster-care.co.uk/policy/safeguarding" },
                ])}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)]" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <Lock className="w-3.5 h-3.5 mr-2 inline" />
                                    Safety is Our Priority
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95]">
                                    Our <span className="text-emerald-400 italic">Safeguarding</span> Policy
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                    Protecting children and supporting carers. Our rigorous standards create a foundation of trust and safety for everyone involved.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-emerald-500/20 border-none" asChild>
                                        <Link href="/contact">
                                            Speak to a Safety Officer
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="/become-a-foster">
                                            Start Your Journey
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-8 flex justify-center gap-6">
                                    <Link href="/policy/support" className="text-emerald-400/60 hover:text-emerald-400 font-bold text-sm transition-colors">Support Policies</Link>
                                    <Link href="/policy/training" className="text-emerald-400/60 hover:text-emerald-400 font-bold text-sm transition-colors">Training Standards</Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Pillars Section */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {safeguardingPillars.map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm transition-all duration-300 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        <pillar.icon className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{pillar.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{pillar.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vetting Detail */}
                <section className="py-20 md:py-32 bg-background-sand overflow-hidden">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest mb-6">
                                    <div className="w-10 h-px bg-emerald-500" />
                                    Transparency
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    Our Rigorous <span className="text-emerald-500 italic">Vetting Process</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
                                    We believe that comprehensive checks aren't just about security—they're about building a safe, trusting foundation for foster carers and children alike.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    {vettingSteps.map((step, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">
                                                    {i + 1}
                                                </div>
                                                <h3 className="font-black text-slate-900 leading-tight">{step.title}</h3>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group">
                                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
                                    <img
                                        src="/images/safeguarding-hero.jpg"
                                        alt="Child holding hands with adult"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1484981138212-dc199320e897?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reporting & Support */}
                <section className="py-20 md:py-32 bg-slate-950 text-white">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <PhoneCall className="w-16 h-16 md:w-24 md:h-24 text-emerald-500" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Reporting & Support</h2>
                                    <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed mb-8">
                                        Safeguarding isn't just about prevention; it's about responsive action. We provide 24/7 incident reporting channels and immediate therapeutic support for both carers and children.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold text-sm">24/7 Support Line</div>
                                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold text-sm">Crisis Intervention</div>
                                    </div>
                                </div>
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
