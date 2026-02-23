"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    ShieldCheck,
    Heart,
    HelpCircle,
    Scale,
    Building2,
    Users,
    MapPin,
    Clock,
    Home,
    Baby,
    Stethoscope,
    HeartHandshake,
    Award,
    Phone,
    FileText,
    Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency, FAQ } from "@/services/dataService";
import { useAvailableRegions } from "@/hooks/useAvailableRegions";
import { useLocationContent } from "@/hooks/useLocationContent";
import { CountryFilters } from "./CountryFilters";

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

function EnglandMap() {
    return (
        <svg viewBox="0 0 300 350" className="w-full h-full opacity-15" fill="none">
            <path 
                d="M50 280 L80 270 L100 275 L120 260 L140 265 L160 250 L180 245 L200 250 L220 235 L240 240 L260 230 L270 210 L280 180 L285 150 L280 120 L270 100 L250 90 L230 85 L210 90 L190 80 L170 75 L150 80 L130 75 L110 80 L90 90 L70 100 L55 120 L45 150 L40 180 L35 210 L40 240 L45 260 Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none"
                className="text-emerald-400"
            />
            <circle cx="150" cy="200" r="3" className="text-emerald-400" fill="currentColor"/>
            <circle cx="130" cy="280" r="2" className="text-emerald-400" fill="currentColor"/>
            <circle cx="200" cy="230" r="2" className="text-emerald-400" fill="currentColor"/>
            <circle cx="180" cy="100" r="2" className="text-emerald-400" fill="currentColor"/>
            <circle cx="120" cy="150" r="2" className="text-emerald-400" fill="currentColor"/>
            <path d="M60 200 Q100 180 140 190 T220 170" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-emerald-400/50" fill="none"/>
        </svg>
    )
}

function RegionMapVisual() {
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full opacity-20" fill="none">
            <ellipse cx="200" cy="100" rx="180" ry="80" stroke="currentColor" strokeWidth="1" className="text-slate-300" fill="none"/>
            <ellipse cx="200" cy="100" rx="140" ry="60" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" fill="none"/>
            <ellipse cx="200" cy="100" rx="100" ry="40" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" fill="none"/>
            <circle cx="80" cy="90" r="4" className="text-emerald-500" fill="currentColor"/>
            <circle cx="130" cy="70" r="3" className="text-emerald-500" fill="currentColor"/>
            <circle cx="180" cy="85" r="5" className="text-emerald-500" fill="currentColor"/>
            <circle cx="220" cy="60" r="3" className="text-emerald-500" fill="currentColor"/>
            <circle cx="280" cy="80" r="4" className="text-emerald-500" fill="currentColor"/>
            <circle cx="320" cy="100" r="3" className="text-emerald-500" fill="currentColor"/>
            <circle cx="100" cy="130" r="3" className="text-emerald-500" fill="currentColor"/>
            <circle cx="160" cy="140" r="4" className="text-emerald-500" fill="currentColor"/>
            <circle cx="250" cy="130" r="3" className="text-emerald-500" fill="currentColor"/>
            <path d="M80 90 L130 70 L180 85 L220 60 L280 80" stroke="currentColor" strokeWidth="0.5" className="text-emerald-400/50" strokeDasharray="3 3" fill="none"/>
        </svg>
    )
}

export function CountryTemplate({
    location,
    childLocations,
    agencies,
    stats,
}: LocationPageProps) {
    const locationName = location.name;
    const locationSlug = location.slug;
    const isEngland = location.slug === "england" || locationName === "England";
    
    const { data: locationContent } = useLocationContent(isEngland ? "england" : locationSlug);
    const { data: availableRegions, isLoading: loadingRegions } = useAvailableRegions(childLocations);
    
    const typesFromContent = locationContent?.content?.types_of_fostering?.categories || [];
    
    const regionsWithContent = childLocations.filter((region) => {
        if (!availableRegions) return false;
        return availableRegions.some(
            (ar) => ar.slug === region.slug
        );
    });

    const regionDescriptors: Record<string, string> = {
        "london": "Capital city with diverse communities",
        "south-east-england": "Home to Brighton, Reading, and coastal towns",
        "east-of-england": "From Cambridge to Norfolk coast",
        "south-west-england": "Bristol, Cornwall, Devon, and beyond",
        "west-midlands": "Birmingham, Coventry, and the Black Country",
        "east-midlands": "Nottingham, Leicester, Derby",
        "yorkshire-and-the-humber": "Leeds, Sheffield, York, and the coast",
        "north-west-england": "Manchester, Liverpool, Lancashire",
        "north-east-england": "Newcastle, Sunderland, Durham",
    };

    const howFosteringWorks = [
        { 
            step: "1", 
            title: "Initial Enquiry", 
            desc: "Get in touch to learn more about what's involved.",
            icon: Phone
        },
        { 
            step: "2", 
            title: "Home Visit", 
            desc: "A social worker visits to answer questions and assess suitability.",
            icon: FileText
        },
        { 
            step: "3", 
            title: "Assessment", 
            desc: "Complete training and a comprehensive assessment (Form F).",
            icon: Award
        },
        { 
            step: "4", 
            title: "Approval", 
            desc: "Become an approved foster foster and start your journey.",
            icon: HeartHandshake
        },
    ];

    const supportPoints = [
        { title: "Ofsted Regulation", desc: "All agencies are regulated by Ofsted for quality and safety.", icon: Scale },
        { title: "Safeguarding", desc: "Robust safeguarding policies protect children and carers.", icon: ShieldCheck },
        { title: "Allowances", desc: "Competitive fostering allowances cover the cost of caring.", icon: Heart },
        { title: "Ongoing Support", desc: "24/7 support lines, training, and dedicated social workers.", icon: Users },
    ];

    const typesOfFosteringHeading = locationContent?.content?.types_of_fostering?.heading || "Types of Fostering";
    const typesOfFosteringIntro = locationContent?.content?.types_of_fostering?.intro || "Different children need different types of care.";
    
    const typesOfFostering = typesFromContent.length > 0 ? typesFromContent : [
        { title: "Short-Term", slug: "short-term", description: "Temporary care while long-term plans are made." },
        { title: "Long-Term", slug: "long-term", description: "Ongoing care until the child reaches adulthood." },
        { title: "Emergency", slug: "emergency", description: "Same-day placements for urgent situations." },
        { title: "Respite", slug: "respite", description: "Short breaks for children and their main carers." },
        { title: "Parent & Child", slug: "parent-child", description: "Supporting a parent and their child together." },
        { title: "Therapeutic", slug: "therapeutic", description: "Specialist care for children with complex needs." },
    ];

    const getServiceUrl = (type: { url?: string; slug?: string }) => {
        if (type.url) {
            let url = type.url;
            if (!url.startsWith('/')) {
                url = '/' + url;
            }
            if (!url.startsWith('/locations')) {
                url = '/locations/england' + url;
            }
            return url;
        }
        return `/locations/england/${type.slug}`;
    };

    const whoItsFor = [
        "Families exploring whether fostering is right for them",
        "People wanting to understand the UK's fostering system",
        "Those comparing independent agencies vs local authorities",
        "Anyone curious about types of fostering available",
    ];

    const nationalFaqs = [
        {
            question: "What's the difference between an independent fostering agency and a local authority?",
            answer: "Independent fostering agencies (IFAs) are private organisations that recruit and support foster carers. Local authorities run their own in-house fostering services. Both are regulated by Ofsted and provide thorough support. The main differences are often in the type of placements available, training offered, and the size of the support network."
        },
        {
            question: "How long does the approval process take?",
            answer: "The fostering assessment process typically takes 4-6 months from your initial enquiry to being approved as a foster carer. This includes background checks, medicals, references, and completing a thorough assessment with your social worker."
        },
        {
            question: "Can I work and still foster?",
            answer: "Yes, many foster carers work either part-time or full-time. However, you need flexibility to attend training, meetings, and support your foster child's school and appointments. Some placement types, like short-term or respite, are more compatible with working."
        },
        {
            question: "What financial support is available?",
            answer: "Foster carers receive a weekly allowance to cover the cost of caring for a child. This varies by agency and placement type, but typically ranges from £450-£650 per week. The allowance is often tax-free. Additional payments may be available for special circumstances."
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* 1. HERO: NATIONAL, HUMAN, ALIVE */}
            <section className="relative py-28 md:py-36 lg:py-44 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-700/30 rounded-full blur-3xl"></div>
                </div>
                
                {/* England Map Silhouette */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full max-w-md hidden lg:block">
                    <EnglandMap />
                </div>
                
                <div className="relative container-main px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400 uppercase tracking-wider">National Overview</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Fostering in {locationName}
                        </h1>
                        
                        <p className="text-lg text-stone-300 leading-relaxed mb-4 max-w-2xl">
                            {locationName}'s fostering system brings together independent agencies and local authorities, all regulated by Ofsted. Whether you're exploring for the first time or ready to find an agency, this guide helps you understand your options.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <CountryFilters country={locationSlug} />
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
                                <Link href="#regions">
                                    Browse Regions
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="text-stone-400 hover:text-white"
                                asChild
                            >
                                <Link href="/become-a-foster">
                                    Find Agencies
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Hero termination */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 text-slate-900">
                        <path d="M0 80C240 80 480 80 720 40C960 0 1200 0 1440 40L1440 80H0Z" fill="currentColor"/>
                    </svg>
                </div>
            </section>

            {/* 2. WHY FOSTERING MATTERS - Two column with visual */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                                Why Fostering Matters Across England
                            </h2>
                            <div className="space-y-4 text-base text-stone-600 leading-relaxed">
                                <p>
                                    Foster care provides stability and safety for children who cannot live with their birth families. Whether for a few nights, several months, or long-term, foster carers offer consistent, nurturing environments where children can thrive.
                                </p>
                                <p>
                                    England's fostering framework ensures high standards through Ofsted regulation, mandatory training, and ongoing support for all registered carers. This national consistency means every child and family receives a baseline of quality care, regardless of region or agency.
                                </p>
                                <p>
                                    The need for foster carers is constant. Children come into care for many reasons - family illness, safeguarding concerns, or emergency situations. Each child deserves a safe, predictable home where they can feel valued and supported.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-emerald-50 to-slate-100 rounded-2xl flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Home className="w-12 h-12 text-emerald-600" />
                                    </div>
                                    <p className="text-sm font-medium text-stone-600">Stability</p>
                                    <p className="text-xs text-stone-400">A safe place to call home</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-50 rounded-xl flex items-center justify-center">
                                <Heart className="w-8 h-8 text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>

            {/* 3. HOW FOSTERING WORKS - Timeline flow */}
            <section className="py-20 md:py-28 bg-stone-50">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                            How Fostering Works
                        </h2>
                        <p className="text-stone-600 max-w-xl mx-auto">
                            The process follows a clear path from initial enquiry to approval. Each step includes checks, training, and support.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 hidden md:block"></div>
                        
                        <div className="space-y-12">
                            {howFosteringWorks.map((item, i) => (
                                <div key={i} className={`flex gap-6 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 md:text-right">
                                        <div className="flex items-center gap-4 md:justify-end">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                                                <item.icon className="w-7 h-7 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                                <p className="text-sm text-stone-600 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-16 flex justify-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold text-sm shrink-0 z-10">
                                            {item.step}
                                        </div>
                                    </div>
                                    <div className="flex-1 hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-12 text-sm text-stone-500 text-center italic bg-white py-4 rounded-xl border border-stone-100">
                        The entire process typically takes 4–6 months from your first enquiry to being approved.
                    </p>
                </div>
            </section>

            {/* 4. INDEPENDENT VS LOCAL AUTHORITY - Split cards with icons */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                        Independent Agencies vs Local Authorities
                    </h2>
                    <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                        Both options are regulated, supportive, and rewarding. Here's a balanced comparison to help you understand the differences.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border-2 border-stone-100 rounded-2xl hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Independent Fostering Agencies
                                </h3>
                            </div>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                Private organisations that recruit, train, and support foster carers. Often offer specialist placements and 24/7 support lines.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Specialised training programmes",
                                    "24/7 support hotlines",
                                    "Often larger support networks",
                                    "Range of placement types"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 border-2 border-stone-100 rounded-2xl hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <ShieldCheck className="w-7 h-7 text-slate-700" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Local Authority Fostering
                                </h3>
                            </div>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                Each local council runs its own fostering service, directly recruiting and supporting carers for children in their care.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Closer to children's home areas",
                                    "Direct links to children's services",
                                    "Often shorter assessment process",
                                    "Support local looked-after children"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TYPES OF FOSTERING - Icon grid */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                        {typesOfFosteringHeading}
                    </h2>
                    <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                        {typesOfFosteringIntro}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {typesOfFostering.map((type, i) => {
                            const linkUrl = getServiceUrl(type);
                            const ctaText = type.cta_text || "Learn more";
                            
                            return (
                                <div key={i} className="p-5 bg-white border border-stone-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all">
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        <Link 
                                            href={linkUrl}
                                            className="hover:text-emerald-700 transition-colors"
                                        >
                                            {type.title}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-stone-500 mb-3">{type.description}</p>
                                    <Link 
                                        href={linkUrl}
                                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                                    >
                                        {ctaText}
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. REGIONS OF ENGLAND - Map visual */}
            <section id="regions" className="py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
                {/* <div className="absolute inset-0 opacity-10">
                    <RegionMapVisual />
                </div> */}
                
                <div className="container-main px-4 max-w-5xl mx-auto relative z-10">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-center text-white">
                        Explore Regions in {locationName}
                    </h2>
                    <p className="text-stone-400 text-center mb-12 max-w-xl mx-auto">
                        Each region has its own fostering landscape. Select a region to find local agencies and detailed information.
                    </p>

                    {loadingRegions ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : regionsWithContent.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {regionsWithContent.map((region) => (
                                <Link 
                                    key={region.id} 
                                    href={`/locations/${location.slug}/${region.slug}`}
                                    className="group block p-6 border border-stone-700 rounded-xl hover:border-emerald-500 hover:bg-slate-800/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                            {region.name}
                                        </h3>
                                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-sm text-stone-400">
                                        {regionDescriptors[region.slug] || "Regional fostering information"}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-stone-400">No regions with content available yet.</p>
                            <p className="text-stone-500 text-sm mt-2">Check back soon for regional information.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 7. SUPPORT & STANDARDS - Trust icons */}
            <section className="py-20 md:py-28 bg-emerald-900">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-12 text-center">
                        Support & Standards
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {supportPoints.map((item, i) => (
                            <div key={i} className="flex gap-5">
                                <div className="w-12 h-12 rounded-xl bg-emerald-800/50 flex items-center justify-center shrink-0">
                                    <item.icon className="w-6 h-6 text-emerald-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-emerald-100/70">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. WHO THIS PAGE IS FOR */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                        Who This Guide Is For
                    </h2>
                    <p className="text-stone-600 text-center mb-8">
                        This page helps orient anyone exploring the UK fostering system.
                    </p>

                    <ul className="space-y-3">
                        {whoItsFor.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-4 rounded-xl">
                                <Heart className="w-4 h-4 text-emerald-600" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Visual Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>

            {/* 9. FAQ - Accordion with icons */}
            <section className="py-20 md:py-28 bg-stone-50">
                <div className="container-main px-4 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <HelpCircle className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-semibold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="bg-white rounded-xl overflow-hidden shadow-sm">
                        {nationalFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-stone-100">
                                <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 10. FINAL CTA */}
            <section className="py-20 md:py-28 bg-slate-900 text-white">
                <div className="container-main px-4 max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
                        Ready to Explore Further?
                    </h2>
                    <p className="text-stone-300 mb-8 max-w-lg mx-auto">
                        Browse regions to find local agencies, or explore the different types of fostering available.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
                            <Link href="#regions">
                                Explore Regions
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-stone-600 text-slate-900 hover:text-white hover:bg-stone-800 rounded-full px-8" asChild>
                            <Link href="/become-a-foster">
                                Browse Agencies
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
