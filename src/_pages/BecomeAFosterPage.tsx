"use client";

import { motion } from "framer-motion";
import {
    CheckCircle,
    ArrowRight,
    Users,
    Home,
    ShieldCheck,
    Heart,
    Sparkles,
    HelpCircle,
    BadgeCheck,
    Clock,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { ProcessSection } from "@/components/locations/shared/ProcessSection";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function BecomeAFosterPage() {
    const eligibilityCriteria = [
        {
            icon: Users,
            title: "Age & Residency",
            desc: "You must be at least 21 years old and have the right to live and work in the UK.",
        },
        {
            icon: Home,
            title: "Spare Bedroom",
            desc: "A spare room is essential to give a child their own private, stable space.",
        },
        {
            icon: ShieldCheck,
            title: "Stability",
            desc: "Your home environment should be safe, stable, and nurturing for a child.",
        }
    ];

    const requirements = [
        {
            title: "Personal Requirements",
            items: [
                "Patience, empathy, and emotional resilience",
                "Ability to provide a safe and nurturing environment",
                "Flexibility to attend meetings and training sessions",
                "Good communication skills (working with social workers)"
            ]
        },
        {
            title: "Home & Financial",
            items: [
                "A spare bedroom solely for the foster child",
                "Reasonably healthy lifestyle and physical fitness",
                "Financial stability (though you don't need to be wealthy)",
                "Safe, smoke-free home environment"
            ]
        }
    ];

    const commonConcerns = [
        {
            question: "Do I need to be in a relationship?",
            answer: "No. You can be single, married, in a civil partnership, or cohabiting. What matters is your ability to support a child."
        },
        {
            question: "What if I rent my home?",
            answer: "Whether you own or rent, you can foster as long as your home is stable and you have permission from your landlord (if applicable) and a spare bedroom."
        },
        {
            question: "Can I foster if I have pets?",
            answer: "Yes, many foster carers have pets. As part of your assessment, a pet safety check will be carried out to ensure they are compatible with children."
        },
        {
            question: "Can I foster if I work full-time?",
            answer: "Many foster carers work. However, you must be able to attend school meetings, health appointments, and training. Some agencies require one carer to be available full-time for certain types of care."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <SEOHead
                title="How to Become a Foster Carer - Guide & Eligibility | Foster Care UK"
                description="Discover how to become a foster carer in the UK. Learn about eligibility, requirements, the application process, and common concerns. Start your journey today."
                canonicalUrl="https://www.foster-care.co.uk/become-a-foster"
                faqData={commonConcerns}
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Become a Foster Carer", url: "https://www.foster-care.co.uk/become-a-foster" },
                ])}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            className="absolute inset-0 bg-[url('/images/hero-pattern.png')] bg-repeat"
                        />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <UserPlus className="w-3.5 h-3.5 mr-2 inline" />
                                    Your Fostering Journey Starts Here
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95]">
                                    Become a <span className="text-primary italic">Foster Carer</span>
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl leading-relaxed font-medium">
                                    Open your heart and your home. Join thousands of families across the UK making a life-changing difference for children in need.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-primary/20" asChild>
                                        <Link href="/contact">
                                            Enquire Now
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="#eligibility">
                                            Check Eligibility
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Eligibility Section */}
                <section id="eligibility" className="py-20 md:py-32 bg-background-sand scroll-mt-20">
                    <div className="container-main px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-slate-950">Who Can Foster?</h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                Fostering is inclusive. We welcome people from all walks of life, regardless of gender, marital status, or sexual orientation.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {eligibilityCriteria.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{item.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Requirements Section */}
                <section className="py-20 md:py-32 bg-white overflow-hidden">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                    <div className="w-10 h-px bg-primary" />
                                    The Essentials
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    What You'll Need <br /><span className="text-primary">to Get Started</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 font-medium">
                                    Beyond a spare room, fostering requires a specific set of qualities and commitments to ensure the best care for children.
                                </p>

                                <div className="space-y-12">
                                    {requirements.map((group, i) => (
                                        <div key={i}>
                                            <h3 className="text-xl font-black mb-4 text-slate-950 flex items-center gap-2">
                                                <BadgeCheck className="w-6 h-6 text-primary" />
                                                {group.title}
                                            </h3>
                                            <ul className="space-y-3 mb-6">
                                                {group.items.map((item, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-slate-600 font-medium">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                            {i === 1 && (
                                                <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-slate-100">
                                                    <Link href="/policy/funding" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                                        Learn about Funding <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                    <Link href="/policy/support" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                                        See Support Options <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                    <Link href="/policy/training" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                                        Training Guide <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-slate-50">
                                    <img
                                        src="/images/become-foster-hero.jpg"
                                        alt="Prospective foster carer"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <ProcessSection locationName="the UK" />

                {/* FAQ Section */}
                <section className="py-20 md:py-32 bg-background-sand">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                <HelpCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                                Common Concerns
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Your Questions, Answered</h2>
                            <p className="text-lg text-slate-600 font-medium">We understand that deciding to foster is a big step. Here are some honest answers to common worries.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {commonConcerns.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-3xl bg-white px-6 md:px-8 py-2 shadow-sm">
                                    <AccordionTrigger className="text-lg md:text-xl font-bold hover:no-underline text-slate-950 py-5 md:py-6 text-left leading-tight group">
                                        <span className="group-hover:text-primary transition-colors">{faq.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-8 font-medium">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-medium mb-6">Still have questions? Our team is here to help you navigate your options.</p>
                            <Button variant="outline" className="rounded-full h-14 px-8 border-slate-200 font-bold hover:bg-white" asChild>
                                <Link href="/contact">Speak to an Advisor</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <CTASection locationName="the UK" />
            </main>

            <Footer />
        </div>
    );
}
