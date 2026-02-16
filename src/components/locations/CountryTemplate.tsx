"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    CheckCircle,
    Info,
    MessageCircle,
    ChevronRight,
    Activity,
    Users,
    ShieldCheck,
    GraduationCap,
    Heart,
    Sparkles,
    Star,
    Quote,
    Clock,
    Home,
    Award,
    Building2,
    BadgeCheck,
    HelpCircle,
    ShieldAlert
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
import { CollapsibleFAQ, FAQItem } from "./shared/CollapsibleFAQ";
import { InteractiveGlossary, GlossaryTerm } from "./shared/InteractiveGlossary";
import { SwipeableCards } from "./shared/SwipeableCards";
import { StickyNav } from "./shared/StickyNav";
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

export function CountryTemplate({
    location,
    childLocations,
    faqs,
    agencies,
    stats
}: LocationPageProps) {
    const { data: blocks } = usePageBlocks(`loc_${location.slug}`);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    const isEngland = location.slug === "england" || locationName === "England";

    // Fallback stats
    const totalCarers = isEngland ? 24300 : (stats.totalCarers || (stats.agenciesCount * 45));
    const weeklyAllowance = isEngland ? "£450–£650" : (stats.weeklyAllowance || "£450 - £650");

    // Sticky Navigation Sections
    const navSections = [
        { id: "why-foster", label: "Why Foster" },
        { id: "process", label: "The Process" },
        { id: "types", label: "Types" },
        { id: "agencies", label: "Agencies" },
        { id: "regions", label: "Regions" },
        { id: "support", label: "Support" },
        { id: "who-its-for", label: "Guide" },
        { id: "glossary", label: "Glossary" },
        { id: "faq", label: "FAQ" }
    ];

    const whyFosterParagraphs = [
        `Fostering in ${locationName} is more than just providing a bed; it's about offering stability, safety, and a future to children who need it most. Currently, with over ${stats.childrenInCare.toLocaleString()} children in care across the nation, the need for compassionate, dedicated foster carers has never been more urgent.`,
        `By choosing to foster here, you are joining a world-class network of support. ${locationName}'s national framework ensures that every carer receives professional training, 24/7 therapeutic support, and competitive financial allowances. Your decision to open your home can break the cycle of instability and give a child the foundation they need to thrive.`,
        `${locationName}'s commitment to foster care excellence means you are never alone on this journey. From the initial enquiry to your first placement and beyond, you will be guided by experts and supported by a community of thousands of carers who share your passion for making a difference.`
    ];

    const typesOfFostering = [
        { icon: Clock, title: "Short-Term", desc: "Temporary care while long-term plans are made.", slug: "short-term-fostering", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
        { icon: Home, title: "Long-Term", desc: "Permanent care where a child stays until adulthood.", slug: "long-term-fostering", color: "from-rose-500/20 to-rose-600/10 border-rose-500/30" },
        { icon: ShieldCheck, title: "Emergency", desc: "Urgent care for children who need a home immediately.", slug: "emergency-fostering", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30" },
        { icon: Users, title: "Respite", desc: "Short breaks for children and their primary carers.", slug: "respite-fostering", color: "from-teal-500/20 to-teal-600/10 border-teal-500/30" },
        { icon: GraduationCap, title: "Parent & Child", desc: "Supporting a parent and their baby together.", slug: "parent-child-fostering", color: "from-violet-500/20 to-violet-600/10 border-violet-500/30" },
        { icon: Award, title: "Therapeutic", desc: "Specialist care for children with complex needs.", slug: "therapeutic-fostering", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" },
    ];

    const expandedFaqs = [
        {
            question: `What are the basic eligibility requirements to foster in ${locationName}?`,
            answer: `To foster in ${locationName}, you typically need to be over 21, have a spare bedroom, and be a full-time UK resident. Your marital status, gender, or sexual orientation does not affect your eligibility. What matters most is your ability to provide a safe, nurturing environment. For more details, visit our <a href="/become-a-foster" class="text-primary font-bold hover:underline">eligibility page</a>.`
        },
        {
            question: "How long does the fostering application process take?",
            answer: "On average, the process from initial enquiry to approval takes between 4 and 6 months. This includes training, background checks, and a comprehensive assessment (Form F) to ensure you're fully prepared for the role."
        },
        {
            question: `What financial support will I receive as a foster carer in ${locationName}?`,
            answer: `All foster carers receive a weekly allowance to cover the costs of caring for a child. In ${locationName}, this typically ranges from ${weeklyAllowance} per child, per week. This allowance is often tax-free. More details can be found on our <a href="/policy/funding" class="text-primary font-bold hover:underline">financial support page</a>.`
        },
        {
            question: "Can I foster if I work full-time?",
            answer: "Yes, many foster carers work. However, you must have the flexibility to attend meetings, training, and support your foster child's needs (like school runs). Some types of fostering, such as respite or short-term, may be more compatible with full-time work."
        },
        {
            question: "What support is available if I'm struggling?",
            answer: "You will have a dedicated supervising social worker and access to a 24/7 support hotline. Many agencies also offer peer support groups and ongoing therapeutic training to help you navigate challenges."
        },
        {
            question: "Do I need to own my own home to foster?",
            answer: "No. Whether you own or rent, as long as your home is stable and has a spare bedroom, you can apply to foster."
        }
    ];

    const displayFaqs = (faqs && faqs.length > 5) ? faqs : expandedFaqs;

    const testimonials = [
        {
            name: "Sarah",
            role: "Foster Carer for 8 years",
            quote: "Fostering in England has been the most rewarding journey of my life. Seeing children grow and thrive is a privilege beyond words.",
            rating: 5
        },
        {
            name: "David",
            role: "Foster Carer for 3 years",
            quote: "The support network here is phenomenal. From the 24/7 hotline to the local peer groups, I never feel alone on this journey.",
            rating: 5
        }
    ];

    const topAgencies = agencies.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            {/* Sticky Navigation */}
            <StickyNav sections={navSections} />

            {/* 1. Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
                {/* Creative Premium Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Primary Glow Blobs */}
                    <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
                    <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow delay-700" />

                    {/* Subtle Grid Pattern */}
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
                                        fallback="National Fostering Excellence"
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
                                    fallback={`Help us transform lives. Discover the rewards of fostering and join ${locationName}'s largest network of approved agencies.`}
                                />
                            </p>

                            {/* Stats Grid - Glassmorphism Premium */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
                                {[
                                    {
                                        value: isEngland ? "24,300+" : `${totalCarers.toLocaleString()}+`,
                                        label: "Approved Carers",
                                        icon: Users
                                    },
                                    {
                                        value: isEngland ? "540+" : `${stats.agenciesCount}+`,
                                        label: "Approved Agencies",
                                        icon: Building2
                                    },
                                    {
                                        value: isEngland ? "£450–£650" : weeklyAllowance,
                                        label: "Weekly Allowance",
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
                                    <Link href={getBlockMetadata(getBlock(blocks, "hero_secondary_cta"), "cta_url", "#agencies")}>
                                        <DynamicContent
                                            block={getBlock(blocks, "hero_secondary_cta")}
                                            fallback="View Local Agencies"
                                        />
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

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent z-0" />
            </section>

            {/* 2. Why Foster Section (LIGHT RHYTHM) */}
            <section id="why-foster" className="scroll-mt-20">
                <div className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <ScrollReveal effect="slideLeft">
                                <SectionIntro
                                    heading={<>Why Foster in <span className="text-primary italic">{locationName}?</span></>}
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
                                        National Policy <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideRight" className="relative">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-sm relative z-10 border border-slate-200">
                                    <img
                                        src={getBlockMetadata(getBlock(blocks, "why_foster_image"), "url", "/images/locations/england-hero.png")}
                                        alt={getBlockMetadata(getBlock(blocks, "why_foster_image"), "alt", `Fostering in ${locationName}`)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-full h-full bg-slate-50 rounded-2xl -z-10 border border-slate-200" />
                            </ScrollReveal>
                        </div>
                    </div>
                </div>

                {/* 10. Fostering by the Numbers */}
                <div className="py-24 md:py-32 bg-white border-y border-slate-200/60 relative overflow-hidden">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<>Fostering <span className="text-primary italic">by the Numbers</span></>}
                                subheading="Large-scale impact, one child at a time."
                                center={true}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.1}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    {
                                        value: isEngland ? "24,300+" : `${totalCarers.toLocaleString()}+`,
                                        label: `Approved Carers in ${locationName}`
                                    },
                                    {
                                        value: isEngland ? "4,000+" : "4,000+",
                                        label: "Annual New Approvals"
                                    },
                                    {
                                        value: "98%",
                                        label: "Carer Satisfaction"
                                    },
                                    {
                                        value: "24/7",
                                        label: "Support Availability"
                                    }
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

            {/* 7. The Process Section (DARK RHYTHM) */}
            <section id="process" className="scroll-mt-20 bg-slate-900 text-white py-24 md:py-32 relative overflow-hidden">
                {/* Background Accent */}
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


                <section id="agency-types" className="py-24 md:py-32 bg-white border-b border-slate-200/60 overflow-hidden scroll-mt-20">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideLeft">
                            <SectionIntro
                                eyebrow="Agency Types"
                                heading={<DynamicContent block={getBlock(blocks, "agency_types_title")} fallback="Independent and Local Authority Fostering Agencies" />}
                                subheading={
                                    <DynamicContent
                                        block={getBlock(blocks, "agency_types_intro")}
                                        fallback={`When exploring your options, you’ll notice that fostering support in ${locationName} comes from two main paths. Each one offers something unique, and the goal is simply to find the path that feels right for you.`}
                                    />
                                }
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
                                                <DynamicContent block={getBlock(blocks, "ifa_card_title")} fallback="Independent Fostering Agencies" />
                                            </h3>
                                        </div>
                                        <div className="text-slate-600 mb-8 font-medium leading-relaxed">
                                            <DynamicContent
                                                block={getBlock(blocks, "ifa_card_content")}
                                                asHtml={true}
                                                fallback={
                                                    <>
                                                        <p className="mb-4">Independent agencies (often called IFAs) operate separately from local councils. Many IFAs offer:</p>
                                                        <ul className="space-y-4">
                                                            {[
                                                                "Stronger day-to-day support",
                                                                "Specialist placements",
                                                                "Therapeutic training",
                                                                "24/7 help",
                                                                "A close-knit carer community"
                                                            ].map((li, idx) => (
                                                                <li key={idx} className="flex items-start gap-3">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                                    {li}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                }
                                            />
                                        </div>
                                    </InteractiveCard>
                                </ScrollRevealItem>

                                <ScrollRevealItem>
                                    <InteractiveCard className="p-8 md:p-10 bg-white border-slate-200 h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                                                <ShieldCheck className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-950 leading-tight">
                                                <DynamicContent block={getBlock(blocks, "la_card_title")} fallback="Local Authority Fostering" />
                                            </h3>
                                        </div>
                                        <div className="text-slate-600 mb-8 font-medium leading-relaxed">
                                            <DynamicContent
                                                block={getBlock(blocks, "la_card_content")}
                                                asHtml={true}
                                                fallback={
                                                    <>
                                                        <p className="mb-4">Local authorities recruit and support carers directly. Some people choose councils because:</p>
                                                        <ul className="space-y-4">
                                                            {[
                                                                "Placements may be closer to children’s home areas",
                                                                "They want direct involvement with children’s services",
                                                                "They prefer council-led support systems"
                                                            ].map((li, idx) => (
                                                                <li key={idx} className="flex items-start gap-3">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                                                                    {li}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                }
                                            />
                                        </div>
                                    </InteractiveCard>
                                </ScrollRevealItem>
                            </div>
                            <div className="mt-8 text-center max-w-2xl mx-auto">
                                <p className="text-slate-500 font-medium italic">
                                    <DynamicContent
                                        block={getBlock(blocks, "agency_types_closing")}
                                        fallback="Both independent agencies and local authorities play important roles. What matters is choosing the one that feels comfortable and supportive for your home."
                                    />
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 4. Types of Fostering Section */}
                <section id="types" className="scroll-mt-20 bg-white">
                    <div className="py-20 md:py-32 overflow-hidden relative border-b border-slate-100">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                        <div className="container-main px-4 relative z-10">
                            <ScrollReveal effect="slideUp">
                                <SectionIntro
                                    eyebrow="Specialisms"
                                    heading={<DynamicContent block={getBlock(blocks, "types_title")} fallback={`Types of Fostering in ${locationName}`} />}
                                    subheading={
                                        <DynamicContent
                                            block={getBlock(blocks, "types_intro")}
                                            fallback="Fostering needs vary across the country. Different children require different types of care, and each type lets you use your strengths in a meaningful way."
                                        />
                                    }
                                    center={true}
                                    inverted={false}
                                />
                            </ScrollReveal>

                            <SwipeableCards className="max-w-7xl mx-auto">
                                {typesOfFostering.map((type, i) => (
                                    <Link href={`/specialisms/${type.slug}`} key={i} className="block h-full">
                                        <InteractiveCard className="p-8 bg-slate-50 border-slate-200 h-full group hover:border-primary/30 transition-all duration-500" hoverLift={true}>
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
                </section>

                {/* 5. The Process Section (Moved Down) */}
                <section id="process" className="scroll-mt-20 bg-slate-900 text-white py-24 md:py-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="container-main px-4 relative z-10">
                        <div className="max-w-4xl mx-auto mb-16">
                            <SectionIntro
                                eyebrow="Your Journey"
                                heading={<DynamicContent block={getBlock(blocks, "process_title")} fallback={`How to Become a Foster Carer in ${locationName}`} />}
                                subheading={
                                    <DynamicContent
                                        block={getBlock(blocks, "process_intro")}
                                        fallback="Becoming a foster carer is not about qualifications, it’s about compassion, stability, and the willingness to learn. Agencies guide you through a respectful and clear approval journey."
                                    />
                                }
                                center={true}
                                inverted={true}
                            />
                        </div>

                        <ScrollReveal effect="slideUp" duration={1}>
                            <ProcessSection locationName={locationName} inverted={true} />
                        </ScrollReveal>

                        <div className="mt-12 text-center">
                            <p className="text-slate-400 font-medium italic">
                                <DynamicContent
                                    block={getBlock(blocks, "process_closing")}
                                    fallback="You’re supported through every step. No one expects you to figure things out alone."
                                />
                            </p>
                        </div>
                    </div>
                </section>

                {/* 6. Ofsted Section (Modified Agencies Section) */}
                <section id="ofsted" className="scroll-mt-20 bg-white border-b border-slate-200/60">
                    <div className="py-24 md:py-32 relative">
                        <div className="container-main px-4 max-w-5xl mx-auto relative z-10">
                            <ScrollReveal effect="slideUp">
                                <SectionIntro
                                    eyebrow="Quality Assurance"
                                    heading={<DynamicContent block={getBlock(blocks, "ofsted_title")} fallback={`Ofsted-Rated Fostering Agencies in ${locationName}`} />}
                                    subheading={
                                        <DynamicContent
                                            block={getBlock(blocks, "ofsted_intro")}
                                            fallback={`Ofsted inspects and rates fostering agencies across ${locationName}. These ratings help you understand quality of support, safeguarding standards, leadership, and outcomes for children.`}
                                        />
                                    }
                                />
                            </ScrollReveal>

                            <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center gap-4 max-w-3xl mx-auto">
                                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                <p className="text-sm md:text-base text-slate-600 font-medium">
                                    <DynamicContent
                                        block={getBlock(blocks, "ofsted_note")}
                                        fallback="Every agency listed on our platform includes clear information about their most recent Ofsted rating so you can make confident, informed decisions."
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Support Section (Moved) */}
                <section id="support" className="py-16 md:py-24 bg-slate-950 text-white scroll-mt-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
                    <div className="container-main px-4 relative z-10">
                        <SectionIntro
                            heading={<DynamicContent block={getBlock(blocks, "support_title")} fallback={`Support for Foster Carers in ${locationName}`} />}
                            subheading={
                                <DynamicContent
                                    block={getBlock(blocks, "support_intro")}
                                    fallback="Strong support makes fostering sustainable and rewarding. Agencies usually provide a mix of emotional, practical, and financial help."
                                />
                            }
                            center={true}
                            inverted={true}
                            className="mb-12 md:mb-16"
                        />

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.08}>
                            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                                {[
                                    {
                                        title: "Financial Support",
                                        desc: "Carers receive fostering allowances to cover the cost of caring for a child, plus additional support for specialist placements.",
                                        icon: ShieldCheck
                                    },
                                    {
                                        title: "Training",
                                        desc: "Ongoing training helps you feel prepared, confident, and supported through your fostering journey.",
                                        icon: GraduationCap
                                    },
                                    {
                                        title: "Emotional Support",
                                        desc: "Regular supervision, support groups, and 24/7 emergency support ensure you never feel alone.",
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

                {/* 8. Regions Section (Moved) */}
                <section id="regions" className="py-24 md:py-32 bg-slate-50 scroll-mt-20 relative border-t border-slate-200/60">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<DynamicContent block={getBlock(blocks, "regions_title")} fallback={`Fostering Across Regions in ${locationName}`} />}
                                subheading={
                                    <DynamicContent
                                        block={getBlock(blocks, "regions_intro")}
                                        fallback={`Each region has its own fostering needs and agency networks. You can explore fostering opportunities in:`}
                                    />
                                }
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.05}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {childLocations.map((region) => (
                                    <ScrollRevealItem key={region.id}>
                                        <Link href={`/locations/${location.slug}/${region.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 border border-slate-200 shadow-sm">
                                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors z-10" />
                                            <img
                                                src="/images/locations/generic-hero.png"
                                                alt={region.name}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-6 right-6 z-20">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-primary group-hover:border-primary transition-all">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                                <div className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">Regional Hub</div>
                                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{region.name}</h3>
                                            </div>
                                        </Link>
                                    </ScrollRevealItem>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 9. Guide Section */}
                <section id="who-its-for" className="py-16 md:py-24 bg-white scroll-mt-20 overflow-hidden">
                    <div className="container-main px-4 max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <ScrollReveal effect="slideLeft">
                                <SectionIntro
                                    eyebrow="Target Audience"
                                    heading={<DynamicContent block={getBlock(blocks, "guide_title")} fallback={`Who This ${locationName} Fostering Guide Is For`} />}
                                    microCopy="Information without pressure."
                                    className="mb-6 md:mb-8"
                                />
                                <div className="text-base text-slate-600 leading-relaxed font-medium">
                                    <DynamicContent
                                        block={getBlock(blocks, "guide_intro")}
                                        fallback="This guide supports anyone exploring foster care, from first-time carers to families comparing agencies. No pressure. No rushing. Just helpful, grounded information."
                                    />
                                </div>
                            </ScrollReveal>

                            <div className="grid sm:grid-cols-1 gap-3">
                                {[
                                    "First-time foster carers",
                                    "Families comparing agencies",
                                    "Carers switching from one agency to another",
                                    "People learning about fostering types",
                                    "Anyone beginning their research"
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

                {/* 10. Glossary Section */}
                <section id="glossary" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200/60 scroll-mt-20 overflow-hidden">
                    <div className="container-main px-4 max-w-6xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                eyebrow="Jargon Buster"
                                heading={<DynamicContent block={getBlock(blocks, "glossary_title")} fallback={`${locationName} Foster Care Glossary`} />}
                                subheading={
                                    <DynamicContent
                                        block={getBlock(blocks, "glossary_intro")}
                                        fallback="A few simple terms to keep things clear:"
                                    />
                                }
                                className="mb-10 md:mb-12"
                            />
                        </ScrollReveal>

                        <InteractiveGlossary
                            className="max-w-4xl mx-auto"
                            terms={[
                                { term: "Foster Carer", definition: "Someone who provides a safe, stable home for a child in care.", icon: Heart },
                                { term: "IFA", definition: "Independent Fostering Agency that supports foster carers outside the council.", icon: Building2 },
                                { term: "Local Authority", definition: "The council responsible for children’s services in your area.", icon: MapPin },
                                { term: "Fostering Allowance", definition: "Financial support for caring for a child.", icon: BadgeCheck },
                                { term: "Ofsted", definition: "The regulator that inspects fostering agencies in England.", icon: ShieldCheck }
                            ]}
                        />
                    </div>
                </section>

                {/* 11. FAQ Section (DARK RHYTHM) */}
                <section id="faq" className="py-24 md:py-32 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

                    <div className="container-main px-4 max-w-4xl mx-auto relative z-10">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<DynamicContent block={getBlock(blocks, "faq_title")} fallback={isEngland ? "England Foster Care FAQ" : "Frequently Asked Questions"} />}
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

                {/* 12. Safety & Disclaimer Section */}
                <section className="py-16 bg-slate-50 border-t border-slate-200/60">
                    <div className="container-main px-4 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-6">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                                <DynamicContent block={getBlock(blocks, "safeguarding_title")} fallback="Safeguarding and Responsibility" />
                            </span>
                        </div>
                        <div className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                            <DynamicContent
                                block={getBlock(blocks, "safeguarding_content")}
                                fallback="We are an independent information platform that helps families explore fostering options. We do not approve carers or place children. All agencies listed must meet current Ofsted standards and follow UK fostering regulations. Your safety, and each child’s safety, always comes first."
                            />
                        </div>
                    </div>
                </section>

                {/* 20. CTA Section */}
                <CTASection
                    locationName={locationName}
                    blocks={blocks}
                />
        </div>
    );
}
