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

    const isEngland = location.slug === "england" || locationName === "England";

    // Fallback stats
    const totalCarers = isEngland ? 24300 : (stats.totalCarers || (stats.agenciesCount * 45));
    const weeklyAllowance = isEngland ? "£450–£650" : (stats.weeklyAllowance || "£450 - £650");

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
                                    <div className="text-3xl md:text-5xl font-black text-primary mb-1">
                                        {isEngland ? "24,300+" : `${totalCarers.toLocaleString()}+`}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Approved Carers</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">
                                        {isEngland ? "540+" : `${stats.agenciesCount}+`}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Approved Agencies</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm sm:col-span-2 lg:col-span-1 flex flex-col items-center justify-center">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">
                                        {isEngland ? "£450–£650" : weeklyAllowance}
                                    </div>
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
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full bg-white border-white text-slate-950 hover:bg-white/90 h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-black shadow-xl shrink-0" asChild>
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

            {/* 3. Is Fostering Right for Me? (Search Intent Targeting) */}
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
                                        Talk to Someone First
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-40 -z-0 rounded-l-[10rem]" />
            </section>

            {/* 7. The Process of Becoming a Foster Carer */}
            <ProcessSection locationName={locationName} />

            {/* 8. Support for Foster Carers */}
            <section className="py-20 md:py-32 bg-slate-900 text-white">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">
                            Support for Foster Carers in {locationName}
                        </h2>
                        <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed">
                            From finances to emotional backup, you’ll never be expected to do this alone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                title: "Financial Support",
                                desc: "Weekly fostering allowances, tax relief and additional payments that recognise the time, energy and care you give.",
                                icon: ShieldCheck
                            },
                            {
                                title: "Emotional Support",
                                desc: "24/7 advice, reflective supervision and peer support so you have someone to talk to when things feel tough.",
                                icon: MessageCircle
                            },
                            {
                                title: "Training & Development",
                                desc: "Ongoing training on attachment, trauma, education and everyday situations, helping you grow in confidence over time.",
                                icon: GraduationCap
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
                            </motion.div>
                        ))}
                    </div>

                    {isEngland && (
                        <div className="mt-16 max-w-2xl mx-auto text-center border border-white/10 rounded-3xl p-6 md:p-8 bg-white/5">
                            <p className="text-sm md:text-base text-white/80 italic leading-relaxed">
                                “The difference for us was the support. Someone picked up the phone at 2am when we were
                                scared we’d got it wrong. We were reminded we weren’t doing this on our own.”
                            </p>
                            <p className="mt-4 text-xs md:text-sm text-white/60 font-medium">
                                Foster carer in England
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* 9. Ofsted-Rated Agencies in England / Country */}
            {isEngland && (
                <section className="py-20 md:py-28 bg-background-sand">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="mb-10 md:mb-12">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                                <ShieldCheck className="w-4 h-4" />
                                Why Ofsted Ratings Matter
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tighter text-slate-950">
                                Choosing a Safe, Well-Led Fostering Agency
                            </h2>
                            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                                Every agency you see on this page is regulated by Ofsted. Their rating gives you a
                                clear signal about how seriously they take quality, safety, and outcomes for children.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    title: "Safeguarding",
                                    desc: "How well agencies protect children, listen to concerns, and respond quickly when something isn’t right."
                                },
                                {
                                    title: "Leadership",
                                    desc: "Whether leaders create a safe, stable culture for carers, staff, and children."
                                },
                                {
                                    title: "Outcomes",
                                    desc: "The difference agencies actually make to children’s lives, education, stability, and wellbeing."
                                }
                            ].map((item) => (
                                <div key={item.title} className="p-6 md:p-7 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <h3 className="text-lg md:text-xl font-black text-slate-950 mb-3">{item.title}</h3>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-sm md:text-base text-slate-600">
                            Look for agencies in the <span className="font-bold text-primary">Featured Agencies</span> section
                            above that clearly display their Ofsted rating. This can be a helpful starting point when comparing options.
                        </p>
                    </div>
                </section>
            )}

            {/* 10. Fostering by the Numbers */}
            <section className="py-20 md:py-32 bg-white relative overflow-hidden">
                <div className="container-main px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-slate-950">
                            Fostering <span className="text-primary italic">by the Numbers</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16 md:mb-24 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2">
                        {[
                            {
                                value: isEngland ? "24,300+" : `${totalCarers.toLocaleString()}+`,
                                label: `Approved Carers in ${locationName}`
                            },
                            {
                                value: isEngland ? "4,000+" : "4,000+",
                                label: isEngland ? "Active Placements" : "New Approvals Last Year"
                            },
                            {
                                value: "98%",
                                label: "Carer Satisfaction"
                            },
                            {
                                value: "24/7",
                                label: "Support Available"
                            }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-slate-50 rounded-3xl md:bg-transparent">
                                <div className="text-4xl md:text-6xl font-black text-slate-950 mb-2">{stat.value}</div>
                                <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. Voices from England (Testimonials) */}
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

            {/* 12. Explore Regions in England / Country */}
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

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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

            {/* 13. England Foster Care FAQ */}
            <section className="py-20 md:py-32 bg-background-sand">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">
                            {isEngland ? "England Foster Care FAQ" : "Frequently Asked Questions"}
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-medium">
                            Clear, honest answers for prospective carers in {locationName}.
                        </p>
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

            {/* 14. Who This Guide Is For */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                                <Info className="w-4 h-4" />
                                Who this guide is for
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-4 tracking-tighter">
                                A calm space to compare, reflect and decide
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                This page is designed to give you clear, pressure-free information. You can take your time,
                                explore different options, and come back whenever you’re ready to move forward.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {[
                                "People exploring fostering for the first time and unsure where to start.",
                                "Existing foster carers considering switching agencies within England.",
                                "Families comparing independent fostering agencies with local authorities.",
                                "Professionals, friends or relatives supporting someone who is thinking about fostering.",
                                "Anyone who wants a simple, human explanation of how fostering works here."
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Types of Fostering in England */}
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

            {/* 5. Independent and Local Authority Agencies */}
            <section className="py-20 md:py-28 bg-background-sand">
                <div className="container-main px-4">
                    <div className="max-w-3xl mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                            <Building2 className="w-4 h-4" />
                            Agency Types
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-4 tracking-tighter">
                            Independent agencies and local authorities
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In {locationName}, you can foster through an Independent Fostering Agency (IFA) or directly with
                            your Local Authority (LA). Both are Ofsted-regulated, but the way they support you can feel
                            different.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                                    Independent Fostering Agencies (IFAs)
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
                                IFAs are specialist organisations that focus solely on recruiting, training and supporting carers.
                            </p>
                            <ul className="space-y-2 text-sm md:text-base text-slate-700">
                                <li>• Often provide very close, relationship-based support for your whole household.</li>
                                <li>• May offer enhanced training, therapeutic input and peer groups.</li>
                                <li>• Work with multiple local authorities to find the right matches for you.</li>
                            </ul>
                        </div>
                        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-slate-900" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                                    Local Authority (Council) Fostering
                                </h3>
                            </div>
                            <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
                                Fostering directly with your local council means being part of the team that holds legal
                                responsibility for children in care.
                            </p>
                            <ul className="space-y-2 text-sm md:text-base text-slate-700">
                                <li>• You work closely with social workers based in your local area.</li>
                                <li>• Placements are usually within your region to keep children connected to their communities.</li>
                                <li>• Support, allowances and training are set by the council’s fostering service.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Featured Agencies in England / Country */}
            <section id="agencies" className="py-20 md:py-32 bg-white scroll-mt-20">
                <div className="container-main px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                                <Building2 className="w-4 h-4" />
                                Local Expertise
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-slate-950">
                                Featured Agencies in <span className="text-primary italic">{locationName}</span>
                            </h2>
                            <p className="text-lg text-slate-600 font-medium">
                                Showing top-rated agencies in {locationName} ready to support your journey.
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
                        {agencies
                            .slice(0, 3)
                            .map((agency) => (
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

                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {agency.city || locationName}
                                        </div>
                                        {agency.ofsted_rating && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-3">
                                                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                                                    Ofsted: {agency.ofsted_rating}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                            {agency.description || `Providing expert foster care support, training and matching for families across ${locationName}.`}
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

            {/* 14. Glossary Section (Optional) */}
            <section
                className="py-20 md:py-28 bg-background-sand"
                aria-labelledby="england-glossary-heading"
            >
                <div className="container-main px-4 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-3">
                                <Info className="w-4 h-4" aria-hidden="true" />
                                Glossary
                            </div>
                            <h2
                                id="england-glossary-heading"
                                className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter mb-3"
                            >
                                Quick glossary for England fostering
                            </h2>
                            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                                A short guide to key fostering terms you&apos;ll see on this page. Each card links to a
                                deeper explanation if you want to read more.
                            </p>
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                        {[
                            {
                                term: "Carer",
                                def: "A person or family who provides a safe, stable and loving foster home for a child.",
                                href: "/glossary/carer",
                                icon: Heart
                            },
                            {
                                term: "IFA (Independent Fostering Agency)",
                                def: "A regulated organisation that recruits, trains and supports foster carers, separate from the local council.",
                                href: "/glossary/independent-fostering-agency",
                                icon: Building2
                            },
                            {
                                term: "LA (Local Authority)",
                                def: "Your local council service responsible for children in care and fostering in your area.",
                                href: "/glossary/local-authority",
                                icon: MapPin
                            },
                            {
                                term: "Ofsted",
                                def: "The government body that inspects and rates fostering agencies and local authorities in England.",
                                href: "/glossary/ofsted",
                                icon: ShieldCheck
                            },
                            {
                                term: "Allowance",
                                def: "The weekly financial support paid to foster carers to cover the day-to-day costs of caring for a child.",
                                href: "/glossary/allowance",
                                icon: BadgeCheck
                            }
                        ].map((item) => (
                            <div
                                key={item.term}
                                className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200 px-5 py-6 md:px-6 md:py-7 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/40"
                                role="group"
                                aria-label={item.term}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <item.icon
                                            className="w-5 h-5 text-primary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            Term
                                        </span>
                                    </div>
                                </div>
                                <dt className="font-black text-slate-950 text-base md:text-lg mb-2">
                                    {item.term}
                                </dt>
                                <dd className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                                    {item.def}
                                </dd>
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={item.href}
                                        className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full px-1.5 py-0.5"
                                    >
                                        <span>Learn more</span>
                                        <ChevronRight className="w-3 h-3" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* 15. Safety & Disclaimer Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/60 px-6 md:px-10 py-8 md:py-10">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
                            Safety, safeguarding & disclaimer
                        </h3>
                        <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                            Foster-care.co.uk is an independent information and comparison platform. We are not a fostering
                            agency and we do not make placement decisions. Our role is to help you understand your options,
                            connect with trusted, Ofsted-regulated fostering agencies and local authorities, and make informed
                            choices about your fostering journey. Always speak directly to your chosen agency or local authority
                            for personalised advice and safeguarding guidance.
                        </p>
                    </div>
                </div>
            </section>

            {/* 17. Final CTA Section */}
            <CTASection locationName={locationName} theme="dark" className="bg-white" />
        </div>
    );
}
