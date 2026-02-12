"use client";

import { motion } from "framer-motion";
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
    BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
import { ProcessSection } from "./shared/ProcessSection";
import { CTASection } from "./shared/CTASection";

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
    const locationName = location.name;

    // Fallback stats
    const totalCarers = stats.totalCarers || (stats.agenciesCount * 45);
    const weeklyAllowance = stats.weeklyAllowance || "£450 - £650";

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

            {/* 1. Hero Section */}
            <section className="relative pt-24 pb-20 md:pt-40 md:pb-36 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src={`/images/locations/${locationName.toLowerCase()}-hero.png`}
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/locations/england-hero.png";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                <Activity className="w-3.5 h-3.5 mr-2 inline" />
                                National Fostering Excellence
                            </Badge>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95] text-white">
                                Fostering in <span className="text-primary italic">{locationName}</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                Help us transform lives. Discover the rewards of fostering and join {locationName}'s largest network of approved agencies.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-14 max-w-4xl mx-auto">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="text-3xl md:text-5xl font-black text-primary mb-1">{totalCarers.toLocaleString()}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Approved Carers</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.agenciesCount}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Approved Agencies</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm sm:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">{weeklyAllowance}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Weekly Allowance</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-10 text-lg md:px-10 text-xl shadow-2xl shadow-primary/20" asChild>
                                    <Link href="/become-a-foster">
                                        Start Your Journey
                                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-black" asChild>
                                    <Link href="#agencies">
                                        View Local Agencies
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster Section */}
            <section className="py-20 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <div className="w-10 h-px bg-primary" />
                                National Impact
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 md:mb-10 tracking-tighter text-slate-950 leading-[1.1]">
                                Why Foster in <br /><span className="text-primary">{locationName}?</span>
                            </h2>
                            <div className="space-y-6 text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                                {whyFosterParagraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>

                            <div className="mt-10 md:mt-12 flex flex-wrap gap-6 md:gap-8">
                                <Link href="/become-a-foster" className="text-primary font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">
                                    Become a Carer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/policy/fostering" className="text-primary font-black flex items-center gap-2 hover:translate-x-1 transition-transform group">
                                    National Policy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-4 md:border-8 border-white">
                                <img
                                    src="/images/locations/england-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-32 h-32 md:w-40 md:h-40 bg-primary/20 rounded-full blur-2xl md:blur-3xl -z-0" />
                            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-48 h-48 md:w-60 md:h-60 bg-primary/10 rounded-full blur-2xl md:blur-3xl -z-0" />
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Agencies Listings Section */}
            <section id="agencies" className="py-20 md:py-32 bg-white scroll-mt-20">
                <div className="container-main px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                                <Building2 className="w-4 h-4" />
                                Local Expertise
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-slate-950">
                                Agencies in <span className="text-primary italic">{locationName}</span>
                            </h2>
                            <p className="text-lg text-slate-600 font-medium">
                                Showing {agencies.length} Agencies in {locationName} ready to support your journey.
                            </p>
                        </div>
                        {agencies.length > 12 && (
                            <Button variant="outline" className="rounded-full border-slate-200 text-slate-950 font-bold hover:bg-slate-50 h-12 px-8" asChild>
                                <Link href={`/find-agencies?filter=${location.slug}`}>
                                    View All Agencies
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agencies.slice(0, 12).map((agency) => (
                            <motion.div
                                key={agency.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group h-full"
                            >
                                <Link href={`/agencies/${agency.slug}`} className="block h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                                {agency.logo_url ? (
                                                    <img src={agency.logo_url} alt={agency.name} className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <Building2 className="w-7 h-7 text-slate-300" />
                                                )}
                                            </div>
                                            {agency.is_verified && (
                                                <BadgeCheck className="w-6 h-6 text-primary" />
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {agency.name}
                                        </h3>

                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {agency.city || locationName}
                                        </div>

                                        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                            {agency.description || `Providing expert foster care support and training for families across ${locationName}.`}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full">
                                                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                                                <span className="font-bold text-xs text-primary">{agency.rating?.toFixed(1) || "4.9"}</span>
                                            </div>
                                            <div className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                                View Profile <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {agencies.length > 12 && (
                        <div className="mt-12 text-center md:hidden">
                            <Button className="w-full rounded-full h-14 font-black" asChild>
                                <Link href={`/find-agencies?filter=${location.slug}`}>
                                    View All {agencies.length} Agencies
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Types of Fostering */}
            <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden">
                <div className="container-main px-4">
                    <div className="text-center mb-16">
                        <Badge className="bg-primary/20 text-primary border-primary/40 mb-4 rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                            Specialisms
                        </Badge>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-white">
                            Types of Fostering Offered in <span className="text-primary italic">{locationName}</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {typesOfFostering.map((type, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/specialisms/${type.slug}`} className={`group block h-full bg-gradient-to-br ${type.color} bg-slate-900/50 rounded-[2rem] md:rounded-[2.5rem] p-8 border border-white/5 hover:border-white/20 transition-all duration-300`}>
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <type.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-3 text-white">{type.title}</h3>
                                    <p className="text-white/70 font-medium leading-relaxed">{type.desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Is Fostering Right for Me? */}
            <section className="py-20 md:py-32 bg-white relative overflow-hidden">
                <div className="container-main px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                            <div className="w-10 h-px bg-primary" />
                            Self-Reflection
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-8 md:mb-10 tracking-tighter text-slate-950 leading-[1.1]">
                            Is Fostering Right <br /><span className="text-primary italic">for Me?</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                            <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                                <p>Becoming a foster carer is a significant lifestyle change. It's natural to have questions about how it will affect your family, your work, and your daily routine.</p>
                                <p>We believe that anyone with a spare room and a big heart can potentially foster. Whether you're single, married, in a same-sex relationship, or have your own children, what matters most is your stability and your commitment to a child's well-being.</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Do you have a spare bedroom?",
                                    "Are you over the age of 21?",
                                    "Do you have a genuine desire to help children?",
                                    "Are you emotionally resilient and patient?",
                                    "Can you provide a stable and safe environment?"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm md:text-base">{item}</p>
                                    </div>
                                ))}
                                <Button className="w-full mt-6 rounded-full h-14 md:h-16 font-black text-lg shadow-xl shadow-primary/10 transition-all active:scale-95" asChild>
                                    <Link href="/become-a-foster">
                                        Check Your Eligibility
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-40 -z-0 rounded-l-[10rem]" />
            </section>

            {/* 5. The Fostering Process Section */}
            <ProcessSection locationName={locationName} />

            {/* 6. Support You’ll Receive */}
            <section className="py-20 md:py-32 bg-slate-900 text-white">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">Support Across {locationName}</h2>
                        <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed">
                            No matter where you are in {locationName}, you are supported by a world-class network of dedicated professionals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                title: "24/7 Hotline",
                                desc: "Round-the-clock access to experienced social workers who can offer advice and support when you need it most.",
                                icon: MessageCircle
                            },
                            {
                                title: "Training Hubs",
                                desc: "Local and regional training centers providing specialized workshops in therapeutic care and child development.",
                                icon: GraduationCap
                            },
                            {
                                title: "Financial Security",
                                desc: "Competitive national allowances plus additional benefits, including tax exemptions and national insurance credits.",
                                icon: ShieldCheck
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-50 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black mb-4 text-white">{item.title}</h3>
                                <p className="text-white/70 font-medium leading-relaxed mb-6 text-sm md:text-base">{item.desc}</p>
                                <Link href="/policy/funding" className="text-primary font-black flex items-center gap-2 text-xs md:text-sm group-hover:gap-3 transition-all">
                                    Learn more about funding <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Social Proof */}
            <section className="py-20 md:py-32 bg-white relative overflow-hidden">
                <div className="container-main px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-slate-950">
                            Fostering <span className="text-primary italic">by the Numbers</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16 md:mb-24">
                        {[
                            { value: `${totalCarers.toLocaleString()}+`, label: `Approved Carers in ${locationName}` },
                            { value: "4,000+", label: "New Approvals Last Year" },
                            { value: "98%", label: "Placement Success Rate" },
                            { value: "24/7", label: "Professional Support" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-slate-50 rounded-3xl md:bg-transparent">
                                <div className="text-4xl md:text-6xl font-black text-slate-950 mb-2">{stat.value}</div>
                                <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {topAgencies.length > 0 && (
                        <div className="bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-950 mb-4">Featured Agencies in {locationName}</h3>
                                <p className="text-slate-500 font-medium">Work with the highest-rated agencies in the country.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {topAgencies.map((agency) => (
                                    <Link
                                        key={agency.id}
                                        href={`/agencies/${agency.slug}`}
                                        className="group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 block text-center"
                                    >
                                        <div className="aspect-video mb-6 rounded-2xl bg-slate-100 overflow-hidden relative">
                                            {agency.logo_url ? (
                                                <img src={agency.logo_url} alt={agency.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 uppercase font-black tracking-widest">{agency.name[0]}</div>
                                            )}
                                        </div>
                                        <h4 className="text-lg md:text-xl font-black text-slate-950 mb-2">{agency.name}</h4>
                                        <div className="flex items-center justify-center gap-1 text-amber-400 mb-4">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <div className="text-primary font-black text-xs md:text-sm flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                            View Profile <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 8. Testimonials Section */}
            <section className="py-20 md:py-32 bg-slate-950 text-white rounded-[2.5rem] md:rounded-[4rem] mx-4 my-8">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                        <Badge className="bg-primary/20 text-primary border-primary/40 mb-4 rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                            Carer Stories
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">Voices from <span className="text-primary italic">{locationName}</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm relative group hover:bg-white/10 transition-colors duration-500 h-full flex flex-col">
                                <Quote className="absolute top-8 right-8 md:top-10 md:right-10 w-12 h-12 md:w-16 md:h-16 text-primary/10" />
                                <div className="flex items-center gap-1 mb-6 text-amber-400">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <blockquote className="text-lg md:text-2xl font-medium leading-relaxed italic mb-8 relative z-10 text-white/90 underline decoration-primary/10 underline-offset-4">"{t.quote}"</blockquote>
                                <div className="mt-auto flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary flex-shrink-0">{t.name[0]}</div>
                                    <div>
                                        <div className="font-black text-white text-base md:text-lg">{t.name}</div>
                                        <div className="text-white/40 text-xs md:text-sm">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Regions Browser */}
            <section id="regions" className="py-20 md:py-32 bg-white scroll-mt-20">
                <div className="container-main px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-tight text-slate-950">Explore Regions in <br /><span className="text-primary italic">{locationName}</span></h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                Start your local journey by exploring the unique foster care landscapes across {locationName}'s key regions.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-6xl lg:text-8xl font-black text-slate-100 select-none uppercase">{locationName.slice(0, 3)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {childLocations.map((region, i) => (
                            <motion.div
                                key={region.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/locations/${location.slug}/${region.slug}`} className="group block relative overflow-hidden rounded-[2rem] md:rounded-[3rem] aspect-[4/3] bg-slate-800 border border-slate-100 shadow-sm">
                                    <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors z-10" />
                                    <img
                                        src="/images/locations/generic-hero.png"
                                        alt={region.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all">
                                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20">
                                        <div className="text-[10px] uppercase tracking-widest text-primary font-black mb-2 flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-primary" />
                                            Regional Hub
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{region.name}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. FAQ Block */}
            <section className="py-20 md:py-32 bg-background-sand">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Frequently Asked Questions</h2>
                        <p className="text-lg md:text-xl text-slate-600 font-medium">Clear, honest answers for prospective carers in {locationName}.</p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                        {displayFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-[1.5rem] md:rounded-3xl bg-white px-6 md:px-8 py-2 overflow-hidden hover:bg-slate-50 transition-colors shadow-sm">
                                <AccordionTrigger className="text-lg md:text-xl font-bold hover:no-underline text-slate-950 py-5 md:py-6 text-left leading-tight group">
                                    <span className="group-hover:text-primary transition-colors">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-8 font-medium border-t border-slate-50 pt-4">
                                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} className="prose prose-slate prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline" />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 11. Final CTA */}
            <CTASection locationName={locationName} theme="dark" className="bg-white" />
        </div>
    );
}
