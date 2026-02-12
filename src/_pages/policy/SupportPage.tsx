"use client";

import { motion } from "framer-motion";
import {
    PhoneCall,
    ArrowRight,
    Users,
    Heart,
    MessageCircle,
    ShieldCheck,
    Stethoscope,
    GraduationCap,
    Clock,
    UserCheck,
    Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function SupportPage() {
    const supportFeatures = [
        {
            icon: PhoneCall,
            title: "24/7 Helpline",
            desc: "Critical support whenever you need it. Our emergency lines are staffed 365 days a year by experienced social workers.",
        },
        {
            icon: UserCheck,
            title: "Dedicated Social Worker",
            desc: "You'll have a consistent point of contact who knows your family and the child in your care intimately.",
        },
        {
            icon: Users,
            title: "Peer Support Networks",
            desc: "Connect with local foster carers for monthly meetups, support groups, and shared experiences.",
        }
    ];

    const supportCategories = [
        {
            title: "Professional Support",
            items: [
                "Frequent home visits from your supervising social worker",
                "Regular local authority review meetings",
                "Assistance with child health and education plans",
                "Crisis intervention and behavioral support"
            ]
        },
        {
            title: "Carer Wellbeing",
            items: [
                "Access to specialized counseling and mental health resources",
                "Paid respite breaks to ensure you can recharge",
                "Social events and recognition awards",
                "Legal protection and insurance coverage"
            ]
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Carer Support & Resources | Foster Care UK"
                description="Explore the comprehensive support available to foster carers in the UK, including 24/7 helplines, peer networks, and dedicated social workers."
                canonicalUrl="https://www.foster-care.co.uk/policy/support"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Support & Resources", url: "https://www.foster-care.co.uk/policy/support" },
                ])}
            />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 opacity-90" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <Heart className="w-3.5 h-3.5 mr-2 inline" />
                                    We're With You Every Step
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95] text-white">
                                    Support for <span className="text-emerald-400 italic">Foster Carers</span>
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                    Fostering is a rewarding journey, but it doesn't have to be a lonely one. Our comprehensive support network ensures you are never without help.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-primary/20" asChild>
                                        <Link href="/contact">
                                            Request Support Info
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="/become-a-foster">
                                            Start Fostering
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Support Features */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            {supportFeatures.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 md:p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-300 group text-center"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">
                                        <item.icon className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{item.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Detailed Support Grid */}
                <section className="py-20 md:py-32 bg-background-sand overflow-hidden">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                    <div className="w-10 h-px bg-primary" />
                                    Holistic Care
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    A Dedicated Support <br /><span className="text-primary italic">System for You</span>
                                </h2>

                                <div className="space-y-12">
                                    {supportCategories.map((group, i) => (
                                        <div key={i}>
                                            <h3 className="text-xl font-black mb-6 text-slate-950 flex items-center gap-3">
                                                <div className="w-2 h-8 bg-primary rounded-full" />
                                                {group.title}
                                            </h3>
                                            <div className="grid sm:grid-cols-1 gap-4">
                                                {group.items.map((item, j) => (
                                                    <div key={j} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                                                        <span className="font-bold text-slate-700">{item}</span>
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
                                        src="/images/support-hero.jpg"
                                        alt="Support group meeting"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial Quote */}
                <section className="py-20 md:py-32 bg-slate-950 text-white">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <Quote className="w-16 h-16 text-primary/20 mx-auto mb-10" />
                            <blockquote className="text-2xl md:text-4xl font-medium italic leading-relaxed mb-10">
                                "The 24/7 hotline has been a lifesaver. Knowing that I can pick up the phone at 3 AM and speak to someone who understands the complexity of foster care gives me incredible peace of mind."
                            </blockquote>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary">M</div>
                                <div className="text-left">
                                    <div className="font-black text-white text-lg">Mark Walters</div>
                                    <div className="text-white/40 text-sm italic">Foster Carer for 5 years</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
