"use client";

import { motion, useScroll } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    CheckCircle,
    MessageCircle,
    ChevronRight,
    Activity,
    Users,
    ShieldCheck,
    GraduationCap,
    Heart,
    Star,
    Building2,
    BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { Location, Agency, FAQ } from "@/services/dataService";
import { StickyNav } from "./shared/StickyNav";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { SectionIntro } from "./shared/SectionIntro";
import { CollapsibleFAQ } from "./shared/CollapsibleFAQ";
import { InteractiveCard } from "./shared/InteractiveCard";
import { usePageBlocks } from "@/hooks/usePageBlocks";
import { useLocationContent, LocationContentData } from "@/hooks/useLocationContent";
import { DynamicContent } from "@/components/shared/DynamicContent";

export interface LocationPageProps {
    location: Location;
    childLocations: Location[];
    path: Location[];
    faqs: FAQ[];
    agencies: Agency[];
    stats: {
        childrenInCare: number;
        boroughs: number;
        agenciesCount: number;
        totalCarers?: number;
        weeklyAllowance?: string;
    };
}

export function RegionTemplate({
    location,
    childLocations,
    faqs,
    agencies,
    stats,
    path
}: LocationPageProps) {
    const pathSlug = path && path.length > 0 
        ? path.map(p => p.slug).join('/')
        : location.slug;
    
    const { data: blocks } = usePageBlocks(`loc_${pathSlug}`);
    const { data: locationContent } = useLocationContent(location.slug);
    
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    const c = locationContent?.content;

    const navSections = [
        { id: "why-foster", label: "Why Foster" },
        { id: "agencies", label: "Agencies" },
        { id: "how-it-works", label: "How It Works" },
        { id: "placements", label: "Placements" },
        { id: "choose-agency", label: "Choose Agency" },
        { id: "process", label: "Process" },
        { id: "ofsted", label: "Ofsted" },
        { id: "support", label: "Support" },
        { id: "areas", label: "Areas" },
        { id: "faq", label: "FAQ" },
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <StickyNav sections={navSections} />

            {/* 1. Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow delay-700" />
                </div>

                <div className="container-main relative z-10 px-4 py-20">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 shadow-2xl backdrop-blur-md">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Regional Fostering Hub
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-10 tracking-tight leading-[1] text-white">
                                {c?.title || locationContent?.title || `Fostering in ${locationName}`}
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
                                {c?.cta?.paragraph || `Explore fostering agencies across ${locationName}, compare support packages, and start your fostering journey with confidence.`}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
                                {[
                                    { value: `${stats.childrenInCare.toLocaleString()}+`, label: "Children in Care", icon: Users },
                                    { value: `${stats.boroughs || childLocations.length}`, label: "Local Areas", icon: Building2 },
                                    { value: `${stats.agenciesCount}+`, label: "Verified Agencies", icon: Heart }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                                        className="relative group overflow-hidden px-8 py-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-primary/30 hover:-translate-y-2"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -mr-12 -mt-12 transition-colors group-hover:bg-primary/20" />
                                        <div className="flex flex-col items-center justify-center relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                                                <stat.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight transition-colors group-hover:text-primary">
                                                {stat.value}
                                            </div>
                                            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white font-black h-16 px-12 text-xl shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 group"
                                    asChild
                                >
                                    <Link href="/become-a-foster">
                                        {c?.cta?.button_text || "Start Your Journey"}
                                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-16 px-12 text-xl font-black backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                                    asChild
                                >
                                    <Link href="#agencies">
                                        View Local Agencies
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Scroll</span>
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent z-0" />
            </section>

            {/* 2. Why Fostering Section */}
            {c?.why_fostering_matters && (
                <section id="why-foster" className="scroll-mt-20">
                    <div className="py-24 md:py-32 bg-white">
                        <div className="container-main px-4">
                            <div className="max-w-4xl mx-auto">
                                <ScrollReveal effect="slideUp">
                                    <SectionIntro
                                        heading={c.why_fostering_matters.heading}
                                        center={true}
                                    />
                                </ScrollReveal>

                                <ScrollReveal effect="slideUp" delay={0.1}>
                                    <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium mt-12">
                                        {c.why_fostering_matters.paragraphs.map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Fostering Agencies Overview */}
            {c?.agency_types && (
                <section id="agencies" className="scroll-mt-20 bg-slate-50 py-24 md:py-32">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.agency_types.heading}
                                subheading={c.agency_types.intro}
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="max-w-4xl mx-auto mt-12">
                            <ScrollReveal effect="slideUp" delay={0.1}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white rounded-xl border border-slate-200">
                                        <h3 className="font-bold text-lg mb-4">{c.agency_types.independent.title}</h3>
                                        <ul className="space-y-3">
                                            {c.agency_types.independent.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-white rounded-xl border border-slate-200">
                                        <h3 className="font-bold text-lg mb-4">{c.agency_types.local_authority.title}</h3>
                                        <ul className="space-y-3">
                                            {c.agency_types.local_authority.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                    <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideUp" delay={0.2}>
                                <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4">Compare:</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {c.agency_types.comparison_points.map((point, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <ChevronRight className="w-4 h-4 text-primary" />
                                                {point}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. How Foster Care Works */}
            {c?.how_fostering_works && (
                <section id="how-it-works" className="scroll-mt-20 py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.how_fostering_works.heading}
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="max-w-4xl mx-auto mt-12">
                            <ScrollReveal effect="slideUp">
                                <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-8">
                                    {c.how_fostering_works.paragraphs.map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideUp" delay={0.1}>
                                <h3 className="text-xl font-bold mb-6">Carers are valued for offering:</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {c.how_fostering_works.qualities.map((quality, i) => (
                                        <ScrollRevealItem key={i}>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                </div>
                                                <span className="font-medium text-slate-700">{quality}</span>
                                            </div>
                                        </ScrollRevealItem>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Types of Foster Placements */}
            {c?.types_of_fostering && (
                <section id="placements" className="scroll-mt-20 py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.types_of_fostering.heading}
                                subheading={c.types_of_fostering.intro}
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
                            {c.types_of_fostering.categories.map((category, i) => (
                                <ScrollRevealItem key={i}>
                                    <InteractiveCard className="p-6 bg-white border-slate-200 h-full">
                                        <h3 className="text-lg font-black mb-3 text-slate-950">{category.name}</h3>
                                        <p className="text-slate-600 font-medium leading-relaxed">{category.description}</p>
                                    </InteractiveCard>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. Independent vs Local Authority (Detailed) */}
            {c?.agency_types && (
                <section id="choose-agency" className="scroll-mt-20 py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading="Independent or Local Authority Fostering: What Should You Choose?"
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
                            <ScrollReveal effect="slideLeft">
                                <div className="p-8 bg-white border-2 border-primary/20 rounded-2xl">
                                    <h3 className="text-2xl font-black mb-4 text-slate-950">
                                        {c.agency_types.independent.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {c.agency_types.independent.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideRight">
                                <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <h3 className="text-2xl font-black mb-4 text-slate-950">
                                        {c.agency_types.local_authority.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {c.agency_types.local_authority.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 7. How to Become a Foster Carer */}
            {c?.how_to_become && (
                <section id="process" className="scroll-mt-20 py-24 md:py-32 bg-slate-900 text-white">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.how_to_become.heading}
                                subheading="If fostering feels right for you, the next step is understanding the process."
                                center={true}
                                inverted={true}
                            />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                            {c.how_to_become.steps.map((step, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-black text-primary">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{step.name}</h3>
                                            <p className="text-slate-300">{step.description}</p>
                                        </div>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>

                        <ScrollReveal effect="slideUp" delay={0.2}>
                            <p className="mt-12 text-center text-slate-300 max-w-2xl mx-auto">
                                {c.how_to_become.note}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 8. Ofsted Ratings */}
            {c?.ofsted && (
                <section id="ofsted" className="scroll-mt-20 py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.ofsted.heading}
                                subheading={c.ofsted.description}
                                center={true}
                            />
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 9. Support for Foster Carers */}
            {c?.support && (
                <section id="support" className="scroll-mt-20 py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.support.heading}
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
                            {c.support.categories.map((category, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                                        <p className="text-slate-600">{category.description}</p>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 10. Areas Covered */}
            {c?.regions && (
                <section id="areas" className="scroll-mt-20 py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.regions.heading}
                                center={true}
                            />
                        </ScrollReveal>

                        <div className="max-w-3xl mx-auto mt-12">
                            <ScrollReveal effect="slideUp" delay={0.1}>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {c.regions.list.map((area, i) => (
                                        <ScrollRevealItem key={i}>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <span className="font-medium">{area}</span>
                                            </div>
                                        </ScrollRevealItem>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 11. FAQs */}
            {c?.faq && (
                <section id="faq" className="scroll-mt-20 py-24 md:py-32 bg-slate-900 text-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={c.faq.heading}
                                subheading="Clear, honest answers for prospective carers."
                                center={true}
                                inverted={true}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.1}>
                            <div className="mt-12 space-y-4">
                                {c.faq.questions.map((faq, i) => (
                                    <CollapsibleFAQ
                                        key={i}
                                        items={[{ question: faq.question, answer: faq.answer, emoji: "💡" }]}
                                        inverted={true}
                                    />
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 12. Our Commitment */}
            {c?.responsibility && (
                <section className="scroll-mt-20 py-24 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto text-center">
                        <ScrollReveal effect="slideUp">
                            <h2 className="text-3xl md:text-4xl font-black mb-8">
                                {c.responsibility.heading}
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.1}>
                            <p className="text-lg text-slate-600">
                                {c.responsibility.paragraph}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 13. CTA Section */}
            {c?.cta && (
                <section className="scroll-mt-20 py-24 md:py-32 bg-slate-950 text-white">
                    <div className="container-main px-4 max-w-4xl mx-auto text-center">
                        <ScrollReveal effect="slideUp">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">
                                {c.cta.heading}
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.1}>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                                {c.cta.paragraph}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.2}>
                            <Button
                                size="lg"
                                className="rounded-full bg-primary hover:bg-primary/90 text-white font-black h-16 px-12 text-xl shadow-2xl shadow-primary/40"
                                asChild
                            >
                                <Link href="/become-a-foster">
                                    {c.cta.button_text}
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </Link>
                            </Button>
                        </ScrollReveal>
                    </div>
                </section>
            )}
        </div>
    );
}
