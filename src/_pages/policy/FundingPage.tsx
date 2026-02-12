"use client";

import { motion } from "framer-motion";
import {
    Coins,
    ArrowRight,
    PiggyBank,
    TrendingUp,
    ShieldCheck,
    Info,
    CheckCircle,
    Banknote,
    Calculator,
    HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/locations/shared/CTASection";

export default function FundingPage() {
    const fundingBasics = [
        {
            icon: Banknote,
            title: "Minimum Allowance",
            desc: "The UK government sets a national minimum allowance, typically ranging from £150 to £250 per week per child, depending on age and location.",
        },
        {
            icon: TrendingUp,
            title: "Enhanced Rates",
            desc: "Independent agencies often offer higher rates, with some carers receiving between £450 and £650 per week to reflect the professional nature of the role.",
        },
        {
            icon: PiggyBank,
            title: "Tax-Free Status",
            desc: "Foster carers benefit from 'Qualifying Care Relief,' meaning a significant portion of their fostering income is completely tax-free.",
        }
    ];

    const coverageItems = [
        { icon: CheckCircle, text: "Healthy, balanced meals and nutrition" },
        { icon: CheckCircle, text: "Clothing, school uniforms, and footwear" },
        { icon: CheckCircle, text: "Personal items and toiletries" },
        { icon: CheckCircle, text: "Travel to school and appointments" },
        { icon: CheckCircle, text: "Extracurricular activities and hobbies" },
        { icon: CheckCircle, text: "Pocket money and savings for the child" },
    ];

    const faqs = [
        {
            question: "Is the fostering allowance considered a salary?",
            answer: "While it functions similarly to an income, it is officially classified as an allowance to cover the costs of caring for a child. However, many agencies include a 'reward' or 'fee' element that recognizes your professional skills."
        },
        {
            question: "Will fostering affect my existing benefits?",
            answer: "In most cases, fostering allowances do not count as income for means-tested benefits like Universal Credit, Housing Benefit, or Council Tax Support. It is always best to check with a specialized advisor."
        },
        {
            question: "Do I get paid between placements?",
            answer: "This varies by agency. Some independent agencies provide 'retainer' payments between placements to ensure your financial stability, while others only pay when a child is in your care."
        },
        {
            question: "Am I self-employed as a foster carer?",
            answer: "Yes, foster carers are classed as self-employed. You will need to register with HMRC, but the specialist tax relief usually means there is little to no tax to pay."
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Care Funding & Allowances Guide | Foster Care UK"
                description="Learn about foster care funding, including the national minimum allowance, tax-free status, and what the allowance covers. Professional support for foster carers."
                canonicalUrl="https://www.foster-care.co.uk/policy/funding"
                faqData={faqs}
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Funding & Allowances", url: "https://www.foster-care.co.uk/policy/funding" },
                ])}
            />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-90" />
                    </div>

                    <div className="container-main relative z-10">
                        <div className="max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                    <Coins className="w-3.5 h-3.5 mr-2 inline" />
                                    Financial Support & Security
                                </Badge>

                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95] text-white">
                                    Fostering <span className="text-emerald-400 italic">Allowances</span>
                                </h1>

                                <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl leading-relaxed font-medium">
                                    Financial support shouldn't be a barrier to making a difference. Learn how allowances provide security for you and the children in your care.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg shadow-2xl shadow-primary/20" asChild>
                                        <Link href="/become-a-foster">
                                            Start Your Journey
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg font-bold" asChild>
                                        <Link href="/contact">
                                            Talk to an Expert
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Funding Basics */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {fundingBasics.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="p-8 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all duration-300 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950">{item.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What it Covers */}
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
                                    Transparency
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-[1.1]">
                                    What Does the <br /><span className="text-primary italic">Allowance Cover?</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
                                    The allowance is designed to cover all the daily costs of raising a child, ensuring they have everything they need to thrive and succeed.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {coverageItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
                                            <item.icon className="w-5 h-5 text-primary shrink-0" />
                                            <span className="font-bold text-slate-800 text-sm">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                    <img
                                        src="/images/funding-hero.jpg"
                                        alt="Foster family enjoying a meal"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1491438590914-bc09fbfaf77a?q=80&w=1000&auto=format&fit=crop'}
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stigma Breaking */}
                <section className="py-20 md:py-32 bg-slate-950 text-white">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-10 mx-auto">
                                <HeartHandshake className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-white">Fostering with Purpose</h2>
                            <p className="text-lg md:text-2xl text-white/70 font-medium leading-relaxed mb-10">
                                "We believe that talking about money shouldn't be taboo. Provide the best life for a child requires resources, and we are committed to ensuring our carers are professionally compensated for their vital work."
                            </p>
                            <div className="flex flex-col items-center gap-6">
                                <Link href="/policy/support" className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-2 transition-colors">
                                    Explore the support network available to you <ArrowRight className="w-5 h-5" />
                                </Link>
                                <div className="flex justify-center gap-2">
                                    <div className="w-12 h-1 bg-primary rounded-full" />
                                    <div className="w-4 h-1 bg-primary/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Block */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                <Calculator className="w-3.5 h-3.5 mr-1.5 inline" />
                                Financial FAQs
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Money Matters</h2>
                            <p className="text-lg text-slate-600 font-medium">Clear answers to your financial questions about foster care.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-3xl bg-slate-50 px-6 md:px-8 py-2 overflow-hidden hover:bg-slate-100 transition-colors shadow-sm">
                                    <AccordionTrigger className="text-lg md:text-xl font-bold hover:no-underline text-slate-950 py-5 md:py-6 text-left leading-tight group">
                                        <span className="group-hover:text-primary transition-colors">{faq.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-8 font-medium">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

            </main>
        </>
    );
}
