"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    CheckCircle,
    Activity,
    Users,
    ShieldCheck,
    GraduationCap,
    Heart,
    Clock,
    Home,
    Award,
    Building2,
    BadgeCheck,
    ShieldAlert,
    MessageCircle,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
import { usePageBlocks, getBlock } from "@/hooks/usePageBlocks";
import { DynamicContent, getBlockMetadata } from "@/components/shared/DynamicContent";
import { ProcessSection } from "./shared/ProcessSection";
import { CTASection } from "./shared/CTASection";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { InteractiveCard } from "./shared/InteractiveCard";
import { SectionIntro } from "./shared/SectionIntro";
import { CarouselSection } from "./shared/CarouselSection";
import { CollapsibleFAQ } from "./shared/CollapsibleFAQ";
import { InteractiveGlossary } from "./shared/InteractiveGlossary";
import { SwipeableCards } from "./shared/SwipeableCards";
import { StickyNav } from "./shared/StickyNav";
import { AgencyListings } from "@/components/location/AgencyListings";
import { useRef } from "react";

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
    const { data: blocks } = usePageBlocks(`loc_${location.slug}`);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    const totalCarers = stats.totalCarers || (stats.agenciesCount * 45);
    const weeklyAllowance = stats.weeklyAllowance || "£450–£650";

    // Sticky Navigation Sections
    const navSections = [
        { id: "why-foster", label: "Why Foster" },
        { id: "process", label: "The Process" },
        { id: "types", label: "Types" },
        { id: "agencies", label: "Agencies" },
        { id: "areas", label: "Local Areas" },
        { id: "support", label: "Support" },
        { id: "who-its-for", label: "Guide" },
        { id: "glossary", label: "Glossary" },
        { id: "faq", label: "FAQ" }
    ];

    const whyFosterParagraphs = [
        `${locationName} is a region of diverse communities, and its foster care system reflects that diversity. Across every local area, children need safe, stable homes where they can regain a sense of routine and security.`,
        `If you're exploring fostering in ${locationName}, our foster care directory gives you a clear way to compare agencies, understand support services, and find organisations that match your values and lifestyle.`,
        `The demand for foster carers remains consistently high across ${locationName}. Carers who can offer routine, patience, and emotional support make an immediate and lasting difference. Many children benefit from staying close to their community, near their school, friends, and familiar surroundings.`
    ];

    const typesOfFostering = [
        { icon: Clock, title: "Short-Term", desc: "Temporary care while long-term plans are being made.", slug: "short-term-fostering", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
        { icon: Home, title: "Long-Term", desc: "Stable homes for children who need consistent care until adulthood.", slug: "long-term-fostering", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30" },
        { icon: ShieldCheck, title: "Emergency", desc: "Same-day placements for children in urgent situations.", slug: "emergency-fostering", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30" },
        { icon: Users, title: "Respite", desc: "Short stays that support families and carers.", slug: "respite-fostering", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30" },
        { icon: GraduationCap, title: "Parent & Child", desc: "Supporting a parent and their baby together.", slug: "parent-child-fostering", color: "from-violet-500/20 to-violet-600/10 border-violet-500/30" },
        { icon: Award, title: "Therapeutic", desc: "Enhanced support for children with emotional or behavioural needs.", slug: "therapeutic-fostering", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" },
    ];

    const expandedFaqs = [
        {
            question: `Is there a high need for foster carers in ${locationName}?`,
            answer: `Yes. Demand remains high across all local areas in ${locationName} due to population changes and varied social needs.`
        },
        {
            question: "Do foster carers get paid?",
            answer: `Yes. Allowances cover child-related expenses and vary by agency and placement type. In ${locationName}, weekly allowances typically range from ${weeklyAllowance} per child.`
        },
        {
            question: "Can I foster if I rent?",
            answer: "Yes. Renting is not a barrier if your home is stable and you have a suitable room."
        },
        {
            question: "How long does approval take?",
            answer: "Most assessments take four to six months. This includes training, background checks, and a comprehensive assessment to ensure you're fully prepared for the role."
        },
        {
            question: "Can I foster if I work full-time?",
            answer: "Yes, many foster carers work. However, you must have the flexibility to attend meetings, training, and support your foster child's needs. Some types of fostering, such as respite or short-term, may be more compatible with full-time work."
        },
        {
            question: "What support is available if I'm struggling?",
            answer: "You will have a dedicated supervising social worker and access to a 24/7 support hotline. Many agencies also offer peer support groups and ongoing therapeutic training to help you navigate challenges."
        }
    ];

    const displayFaqs = (faqs && faqs.length > 5) ? faqs : expandedFaqs;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            {/* Sticky Navigation */}
            <StickyNav sections={navSections} />

            {/* 1. Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
                {/* Creative Premium Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow delay-700" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L40 40 L40 0' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
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
                                    <DynamicContent
                                        block={getBlock(blocks, "hero_badge")}
                                        fallback="Regional Fostering Hub"
                                    />
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-10 tracking-tight leading-[1] text-white">
                                <DynamicContent
                                    block={getBlock(blocks, "hero_title")}
                                    fallback={
                                        <>Fostering in <span className="text-primary italic relative">
                                            {locationName}
                                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                                            </svg>
                                        </span></>
                                    }
                                />
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
                                <DynamicContent
                                    block={getBlock(blocks, "hero_subtitle")}
                                    fallback={`Explore fostering agencies across ${locationName}, compare support packages, and start your fostering journey with confidence.`}
                                />
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
                                {[
                                    {
                                        value: `${stats.childrenInCare.toLocaleString()}+`,
                                        label: "Children in Care",
                                        icon: Users
                                    },
                                    {
                                        value: `${stats.boroughs || childLocations.length}`,
                                        label: "Local Areas",
                                        icon: Building2
                                    },
                                    {
                                        value: `${stats.agenciesCount}+`,
                                        label: "Verified Agencies",
                                        icon: Heart
                                    }
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
                                    <Link href={getBlockMetadata(getBlock(blocks, "hero_cta"), "cta_url", "/become-a-foster")}>
                                        <DynamicContent
                                            block={getBlock(blocks, "hero_cta")}
                                            fallback="Start Your Journey"
                                        />
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

                {/* Scroll Indicator */}
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

            {/* 2. Why Foster Section */}
            <section id="why-foster" className="scroll-mt-20">
                <div className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <ScrollReveal effect="slideLeft">
                                <SectionIntro
                                    heading={<>Why {locationName} Needs More <span className="text-primary italic">Foster Carers</span></>}
                                    subheading="The difference you can make is profound."
                                />

                                <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                                    <DynamicContent
                                        block={getBlock(blocks, "why_foster_content")}
                                        asHtml={true}
                                        fallback={whyFosterParagraphs.map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    />
                                </div>

                                <div className="mt-12 flex flex-wrap gap-8">
                                    <Link href="/become-a-foster" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all group">
                                        Become a Carer <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link href="/policy/fostering" className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 transition-all group">
                                        Fostering Policy <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideRight" className="relative">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-sm relative z-10 border border-slate-200">
                                    <img
                                        src={getBlockMetadata(getBlock(blocks, "why_foster_image"), "url", "/images/locations/generic-hero.png")}
                                        alt={getBlockMetadata(getBlock(blocks, "why_foster_image"), "alt", `Fostering in ${locationName}`)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-full h-full bg-slate-50 rounded-2xl -z-10 border border-slate-200" />
                            </ScrollReveal>
                        </div>
                    </div>
                </div>

                {/* Fostering by the Numbers */}
                <div className="py-24 md:py-32 bg-white border-y border-slate-200/60 relative overflow-hidden">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<>Fostering <span className="text-primary italic">by the Numbers</span></>}
                                subheading={`Impact across ${locationName}, one child at a time.`}
                                center={true}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.1}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { value: `${stats.childrenInCare.toLocaleString()}+`, label: `Children in Care` },
                                    { value: `${stats.boroughs || childLocations.length}`, label: "Local Areas Covered" },
                                    { value: "98%", label: "Carer Satisfaction" },
                                    { value: "24/7", label: "Support Availability" }
                                ].map((stat, i) => (
                                    <ScrollRevealItem key={i}>
                                        <div className="text-center p-10 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                            <div className="text-4xl md:text-5xl font-black text-slate-950 mb-3">{stat.value}</div>
                                            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                                        </div>
                                    </ScrollRevealItem>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 3. Is Fostering Right for Me? + Process (DARK RHYTHM) */}
            <section id="process" className="scroll-mt-20 bg-slate-900 text-white py-24 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="container-main px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <SectionIntro
                            eyebrow="Self-reflection"
                            heading={<>Is fostering right <span className="text-primary italic">for me?</span></>}
                            subheading="A calm checklist to think it through."
                            center={true}
                            inverted={true}
                        />

                        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start mt-16">
                            <ScrollReveal effect="slideLeft" className="space-y-6 text-base md:text-lg text-slate-300 leading-relaxed font-medium pt-2">
                                <DynamicContent
                                    block={getBlock(blocks, "is_right_content")}
                                    asHtml={true}
                                    fallback={
                                        <>
                                            <p>Becoming a foster carer is a significant lifestyle change. It's natural to have questions about how it will affect your family, your work, and your daily routine.</p>
                                            <p>We believe that anyone with a spare room and a big heart can potentially foster. Whether you're single, married, in a same-sex relationship, or have your own children, what matters most is your stability and your commitment to a child's wellbeing.</p>
                                        </>
                                    }
                                />
                            </ScrollReveal>

                            <ScrollReveal effect="slideRight" staggerChildren staggerDelay={0.08}>
                                <div className="space-y-4">
                                    {[
                                        "Do you have a spare bedroom?",
                                        "Are you over the age of 21?",
                                        "Do you have a genuine desire to help children?",
                                        "Are you emotionally resilient and patient?",
                                        "Can you provide a stable and safe environment?"
                                    ].map((item, i) => (
                                        <ScrollRevealItem key={i}>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm flex items-start gap-4 hover:bg-white/10 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                </div>
                                                <p className="font-bold text-slate-100 text-sm md:text-base">{item}</p>
                                            </div>
                                        </ScrollRevealItem>
                                    ))}
                                    <div className="mt-8 pt-4">
                                        <Button className="w-full rounded-full h-16 font-black text-xl shadow-2xl shadow-primary/20 transition-all bg-primary hover:bg-primary/90" asChild>
                                            <Link href="/become-a-foster">
                                                Talk to Someone First
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>

                {/* Process Steps */}
                <div className="mt-32">
                    <ScrollReveal effect="slideUp" duration={1}>
                        <ProcessSection locationName={locationName} inverted={true} />
                    </ScrollReveal>
                </div>
            </section>

            {/* 4. Types of Fostering & Agency Types (LIGHT RHYTHM) */}
            <section id="types" className="scroll-mt-20 bg-white">
                {/* Types of Fostering */}
                <div className="py-20 md:py-32 overflow-hidden relative border-y border-slate-100">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="container-main px-4 relative z-10">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                eyebrow="Placement Types"
                                heading={<>Types of Fostering in <span className="text-primary italic">{locationName}</span></>}
                                center={true}
                                inverted={false}
                            />
                        </ScrollReveal>

                        <SwipeableCards className="max-w-7xl mx-auto">
                            {typesOfFostering.map((type, i) => (
                                <Link
                                    href={`/specialisms/${type.slug}`}
                                    key={i}
                                    className="block h-full"
                                >
                                    <InteractiveCard
                                        className="p-8 bg-slate-50 border-slate-200 h-full group hover:border-primary/30 transition-all duration-500"
                                        hoverLift={true}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                            <type.icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-4 text-slate-950 group-hover:text-primary transition-colors">{type.title}</h3>
                                        <p className="text-slate-600 font-medium leading-relaxed mb-6">{type.desc}</p>
                                        <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Learn More <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </InteractiveCard>
                                </Link>
                            ))}
                        </SwipeableCards>
                    </div>
                </div>

                {/* IFA vs Local Authority */}
                <div className="py-24 md:py-32 bg-white border-b border-slate-200/60 overflow-hidden">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideLeft">
                            <SectionIntro
                                eyebrow="Agency Types"
                                heading="Independent agencies or local authorities?"
                                subheading={`In ${locationName}, you can foster through an Independent Fostering Agency (IFA) or directly with your Local Authority.`}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.15}>
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <ScrollRevealItem>
                                    <InteractiveCard className="p-8 md:p-10 bg-white border-slate-200 h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <Building2 className="w-7 h-7 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-950 leading-tight">
                                                Independent Agencies (IFAs)
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                                            IFAs provide structured support, specialist training, and regular supervision. They often offer 24/7 support lines, therapeutic guidance, and higher allowances.
                                        </p>
                                        <ul className="space-y-4">
                                            {[
                                                "Often provide very close, relationship-based support for your whole household.",
                                                "May offer enhanced training, therapeutic input and peer groups.",
                                                "Work with multiple local authorities to find the right matches for you."
                                            ].map((li, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                    {li}
                                                </li>
                                            ))}
                                        </ul>
                                    </InteractiveCard>
                                </ScrollRevealItem>

                                <ScrollRevealItem>
                                    <InteractiveCard className="p-8 md:p-10 bg-white border-slate-200 h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                                                <ShieldCheck className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-950 leading-tight">
                                                Local Authority (Council)
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                                            Each local area runs its own fostering service. Local authorities focus on keeping placements local, making it easier for children to stay connected to their community.
                                        </p>
                                        <ul className="space-y-4">
                                            {[
                                                "You work closely with social workers based in your local area.",
                                                "Placements are usually within your region to keep children connected.",
                                                "Support, allowances and training are set by the council's service."
                                            ].map((li, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                                    {li}
                                                </li>
                                            ))}
                                        </ul>
                                    </InteractiveCard>
                                </ScrollRevealItem>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 5. Agencies Section (DARK RHYTHM) */}
            <section id="agencies" className="scroll-mt-20 bg-slate-950 text-white">
                {/* Ofsted Quality Section */}
                <div className="py-24 md:py-32 relative border-b border-white/5">
                    <div className="container-main px-4 max-w-5xl mx-auto relative z-10">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                eyebrow="Quality Assurance"
                                heading="Why Ofsted Ratings Matter"
                                subheading={`${locationName} has many fostering agencies, so Ofsted ratings provide important clarity. Our directory helps you compare safeguarding quality, leadership strength, and outcomes for children.`}
                                inverted={true}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.08}>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Safeguarding",
                                        desc: "How well agencies protect children, listen to concerns, and respond quickly when something isn't right."
                                    },
                                    {
                                        title: "Leadership",
                                        desc: "Whether leaders create a safe, stable culture for carers, staff, and children."
                                    },
                                    {
                                        title: "Outcomes",
                                        desc: "The difference agencies actually make to children's lives, education, stability, and wellbeing."
                                    }
                                ].map((item) => (
                                    <ScrollRevealItem key={item.title}>
                                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-sm h-full hover:bg-white/10 hover:border-primary/20 transition-all duration-300">
                                            <h3 className="text-lg md:text-xl font-black text-white mb-4">{item.title}</h3>
                                            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </ScrollRevealItem>
                                ))}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.2}>
                            <div className="mt-12 p-6 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center gap-4 max-w-3xl mx-auto">
                                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                <p className="text-sm md:text-base text-slate-300 font-medium">
                                    Look for agencies in the <span className="font-bold text-primary">Featured Agencies</span> section
                                    below that clearly display their Ofsted rating.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Featured Agencies Carousel */}
                <div className="py-24 md:py-32 overflow-hidden bg-slate-900/50">
                    <div className="container-main px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                            <ScrollReveal effect="slideLeft" className="max-w-2xl">
                                <SectionIntro
                                    eyebrow="Local Expertise"
                                    heading={<>Featured Agencies in <span className="text-primary italic">{locationName}</span></>}
                                    subheading={`Showing top-rated agencies in ${locationName} ready to support your journey.`}
                                    inverted={true}
                                />
                            </ScrollReveal>

                            {agencies.length > 3 && (
                                <ScrollReveal effect="slideRight" className="hidden md:block">
                                    <Button variant="outline" className="rounded-full border-slate-200 text-slate-900 font-bold hover:bg-slate-50 h-14 px-8 mb-4 shadow-sm" asChild>
                                        <Link href={`/find-agencies?filter=${location.slug}`}>
                                            View All Agencies
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </ScrollReveal>
                            )}
                        </div>

                        <ScrollReveal effect="slideUp" delay={0.1}>
                            <CarouselSection
                                className="max-w-7xl mx-auto"
                                showDots={true}
                            >
                                {agencies.slice(0, 6).map((agency) => (
                                    <div key={agency.id} className="px-3 h-full pb-10">
                                        <Link href={`/agencies/${agency.slug}`} className="block h-full group">
                                            <div className="p-8 bg-white border border-slate-200/60 rounded-2xl h-full relative flex flex-col shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-all duration-300">
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                                        {agency.logo_url ? (
                                                            <img src={agency.logo_url} alt={agency.name} className="w-full h-full object-contain p-2" />
                                                        ) : (
                                                            <Building2 className="w-8 h-8 text-slate-300" />
                                                        )}
                                                    </div>
                                                    {agency.is_verified && (
                                                        <BadgeCheck className="w-6 h-6 text-primary" />
                                                    )}
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-black text-slate-950 mb-4 group-hover:text-primary transition-colors line-clamp-1">
                                                    {agency.name}
                                                </h3>

                                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-bold">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {agency.city || locationName}
                                                </div>

                                                {agency.ofsted_rating && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 mb-8 w-fit">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                                                            Ofsted: {agency.ofsted_rating}
                                                        </span>
                                                    </div>
                                                )}

                                                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                                                    {agency.description || `Providing expert foster care support, training and matching for families across ${locationName}.`}
                                                </p>

                                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                        <span className="font-bold text-xs text-slate-700">{agency.rating?.toFixed(1) || "4.9"}</span>
                                                    </div>
                                                    <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </CarouselSection>
                        </ScrollReveal>

                        {agencies.length > 3 && (
                            <ScrollReveal effect="slideUp" className="mt-8 text-center md:hidden">
                                <Button className="w-full rounded-full h-14 font-bold text-lg bg-primary shadow-lg shadow-primary/20" asChild>
                                    <Link href={`/find-agencies?filter=${location.slug}`}>
                                        View All Agencies
                                    </Link>
                                </Button>
                            </ScrollReveal>
                        )}
                    </div>
                </div>
            </section>

            {/* 6. Explore Local Areas */}
            {childLocations.length > 0 && (
                <section id="areas" className="py-24 md:py-32 bg-slate-50 scroll-mt-20 relative border-t border-slate-200/60">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<>Explore Local Areas in <span className="text-primary italic">{locationName}</span></>}
                                subheading={`Find specific fostering information for your local county or borough in the ${locationName} region.`}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.05}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {childLocations.map((child) => (
                                    <ScrollRevealItem key={child.id}>
                                        <Link
                                            href={`/locations/${(path || []).map(p => p.slug).join('/') || location.slug}/${child.slug}`}
                                            className="group block relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 border border-slate-200 shadow-sm"
                                        >
                                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors z-10" />
                                            <img
                                                src="/images/locations/generic-hero.png"
                                                alt={`Foster care in ${child.name}`}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-6 right-6 z-20">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-primary group-hover:border-primary transition-all">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                                <div className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">Local Community</div>
                                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{child.name}</h3>
                                            </div>
                                        </Link>
                                    </ScrollRevealItem>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 7. Support for Foster Carers (DARK RHYTHM) */}
            <section id="support" className="py-16 md:py-24 bg-slate-950 text-white scroll-mt-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
                <div className="container-main px-4 relative z-10">
                    <SectionIntro
                        heading={<>Support for Foster Carers in <span className="text-primary italic">{locationName}</span></>}
                        subheading="From finances to emotional backup, you'll never be expected to do this alone."
                        center={true}
                        inverted={true}
                        className="mb-12 md:mb-16"
                    />

                    <ScrollReveal effect="none" staggerChildren staggerDelay={0.08}>
                        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                            {[
                                {
                                    title: "Carer Allowances",
                                    desc: "Financial allowances help cover the cost of caring for a child, with additional support for specialist placements.",
                                    icon: ShieldCheck
                                },
                                {
                                    title: "Training & Development",
                                    desc: "Regular in-person and online training courses help carers build confidence and skills.",
                                    icon: GraduationCap
                                },
                                {
                                    title: "24/7 Support & Supervision",
                                    desc: "Supervising social workers maintain regular contact and offer round-the-clock guidance.",
                                    icon: MessageCircle
                                }
                            ].map((item, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 h-full flex flex-col items-start hover:bg-white/[0.08] transition-colors group">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-105 transition-transform">
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-black mb-3 text-white">{item.title}</h3>
                                        <p className="text-white/60 font-medium leading-relaxed mb-4 text-sm">{item.desc}</p>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 8. Who This Guide Is For (LIGHT RHYTHM) */}
            <section id="who-its-for" className="py-16 md:py-24 bg-white scroll-mt-20 overflow-hidden">
                <div className="container-main px-4 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <ScrollReveal effect="slideLeft">
                            <SectionIntro
                                eyebrow="Our Commitment"
                                heading="A calm space to reflect and decide"
                                microCopy="Information without pressure."
                                className="mb-6 md:mb-8"
                            />
                            <p className="text-base text-slate-600 leading-relaxed font-medium">
                                We do not approve foster carers or manage placements. We list agencies that follow Ofsted standards
                                and UK safeguarding rules. Our goal is to help families make informed decisions with clear, trustworthy information.
                            </p>
                        </ScrollReveal>

                        <div className="grid sm:grid-cols-1 gap-3">
                            {[
                                "People exploring fostering for the first time.",
                                "Existing carers considering switching agencies.",
                                "Families comparing IFAs with local authorities.",
                                "Anyone seeking a simple explanation of how it works."
                            ].map((item, i) => (
                                <ScrollReveal effect="slideRight" delay={i * 0.1} key={i}>
                                    <InteractiveCard className="p-3 border-slate-100" hoverLift={false} gradientReveal={true}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-3 h-3 text-primary" />
                                            </div>
                                            <p className="text-xs md:text-sm text-slate-700 font-bold">
                                                {item}
                                            </p>
                                        </div>
                                    </InteractiveCard>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Glossary Section */}
            <section id="glossary" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200/60 scroll-mt-20 overflow-hidden">
                <div className="container-main px-4 max-w-6xl mx-auto">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Jargon Buster"
                            heading={<>Quick glossary for <span className="text-primary italic">{locationName}</span></>}
                            subheading="A short guide to key fostering terms you'll see on this page."
                            className="mb-10 md:mb-12"
                        />
                    </ScrollReveal>

                    <InteractiveGlossary
                        className="max-w-4xl mx-auto"
                        terms={[
                            { term: "Carer", definition: "A person or family who provides a safe, stable and loving foster home.", icon: Heart },
                            { term: "IFA", definition: "A regulated organisation that recruits and supports carers, separate from the council.", icon: Building2 },
                            { term: "LA (Council)", definition: "Your local council service responsible for children in care in your area.", icon: MapPin },
                            { term: "Ofsted", definition: "The government body that inspects and rates fostering agencies in England.", icon: ShieldCheck },
                            { term: "Allowance", definition: "The weekly financial support paid to foster carers to cover the costs of care.", icon: BadgeCheck }
                        ]}
                    />
                </div>
            </section>

            {/* 10. FAQ Section (DARK RHYTHM) */}
            <section id="faq" className="py-24 md:py-32 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="container-main px-4 max-w-4xl mx-auto relative z-10">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            heading={`${locationName} Foster Care FAQ`}
                            microCopy={`Clear, honest answers for prospective carers in ${locationName}.`}
                            center={true}
                            inverted={true}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2}>
                        <CollapsibleFAQ
                            items={displayFaqs.map(f => ({
                                question: f.question,
                                answer: f.answer,
                                emoji: "💡"
                            }))}
                            inverted={true}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* 11. Safety & Disclaimer */}
            <section className="py-16 bg-slate-50 border-t border-slate-200/60">
                <div className="container-main px-4 max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-6">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Important Information</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                        FosterCare.co.uk is a free informational resource. While we work with regulated agencies,
                        your specific fostering journey will depend on individual assessments and regional requirements.
                        Always verify details directly with your chosen agency or local authority.
                    </p>
                </div>
            </section>

            {/* 12. CTA Section */}
            <CTASection
                locationName={locationName}
                blocks={blocks}
            />
        </div>
    );
}
