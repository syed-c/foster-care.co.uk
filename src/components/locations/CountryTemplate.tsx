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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency, FAQ } from "@/services/dataService";
import { usePageBlocks, getBlock } from "@/hooks/usePageBlocks";
import { getBlockMetadata } from "@/components/shared/DynamicContent";

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
    agencies,
    stats,
}: LocationPageProps) {
    const pathSlug = location.slug;
    const { data: blocks } = usePageBlocks(`loc_${pathSlug}`);
    const locationName = location.name;

    const isEngland = location.slug === "england" || locationName === "England";

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
        { step: "1", title: "Initial Enquiry", desc: "Get in touch to learn more about what's involved." },
        { step: "2", title: "Home Visit", desc: "A social worker visits to answer questions and assess suitability." },
        { step: "3", title: "Assessment", desc: "Complete training and a comprehensive assessment (Form F)." },
        { step: "4", title: "Approval", desc: "Become an approved foster carer and start your journey." },
    ];

    const supportPoints = [
        { title: "Ofsted Regulation", desc: "All agencies are regulated by Ofsted for quality and safety." },
        { title: "Safeguarding", desc: "Robust safeguarding policies protect children and carers." },
        { title: "Allowances", desc: "Competitive fostering allowances cover the cost of caring." },
        { title: "Ongoing Support", desc: "24/7 support lines, training, and dedicated social workers." },
    ];

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
            {/* 1. HERO: NATIONAL CONTEXT - DARK, RESTRAINED */}
            <section className="relative py-28 md:py-36 lg:py-44 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-700/30 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative container-main px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Fostering Agencies in {locationName}
                        </h1>
                        
                        <p className="text-lg text-stone-300 leading-relaxed mb-4 max-w-2xl">
                            {locationName}'s fostering system is made up of independent agencies and local authorities, all regulated by Ofsted. Whether you're exploring fostering for the first time or ready to find an agency, this page helps you understand your options.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">
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

            {/* 2. WHY FOSTERING MATTERS - LIGHT, EDITORIAL */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-3xl mx-auto">
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
            </section>

            {/* 3. HOW FOSTERING WORKS IN ENGLAND - STRUCTURAL */}
            <section className="py-20 md:py-28 bg-stone-50">
                <div className="container-main px-4 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                        How Fostering Works
                    </h2>
                    <p className="text-stone-600 mb-12">
                        The process follows a clear path from initial enquiry to approval. Each step includes checks, training, and support to ensure you're prepared.
                    </p>

                    <div className="space-y-6">
                        {howFosteringWorks.map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-800 shrink-0">
                                    {item.step}
                                </div>
                                <div className="pt-2">
                                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-stone-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-sm text-stone-500 italic">
                        The entire process typically takes 4–6 months from your first enquiry to being approved.
                    </p>
                </div>
            </section>

            {/* 4. INDEPENDENT VS LOCAL AUTHORITY - NEUTRAL COMPARISON */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                        Independent Agencies vs Local Authorities
                    </h2>
                    <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                        Both options are regulated, supportive, and rewarding. Here's a balanced comparison to help you understand the differences.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 border border-stone-200 rounded-2xl">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Independent Fostering Agencies
                            </h3>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                Private organisations that recruit, train, and support foster carers. Often offer specialist placements and 24/7 support lines.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Specialised training programmes
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    24/7 support hotlines
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Often larger support networks
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Range of placement types
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 border border-stone-200 rounded-2xl">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Local Authority Fostering
                            </h3>
                            <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                                Each local council runs its own fostering service, directly recruiting and supporting carers for children in their care.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Closer to children's home areas
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Direct links to children's services
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Often shorter assessment process
                                </li>
                                <li className="flex items-start gap-3 text-sm text-stone-700">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    Support local looked-after children
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TYPES OF FOSTERING - SUMMARY ONLY */}
            <section className="py-20 md:py-28 bg-stone-50">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                        Types of Fostering
                    </h2>
                    <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                        Different children need different types of care. Here's a summary of the main options.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: "Short-Term", desc: "Temporary care while long-term plans are made (days to months)." },
                            { title: "Long-Term", desc: "Ongoing care until the child reaches adulthood." },
                            { title: "Emergency", desc: "Same-day placements for urgent situations." },
                            { title: "Respite", desc: "Short breaks for children and their main carers." },
                            { title: "Parent & Child", desc: "Supporting a parent and their child together." },
                            { title: "Therapeutic", desc: "Specialist care for children with complex needs." },
                        ].map((type, i) => (
                            <div key={i} className="p-5 bg-white border border-stone-100 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-1">{type.title}</h3>
                                <p className="text-sm text-stone-600">{type.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. REGIONS OF ENGLAND - PRIMARY FOCUS */}
            <section id="regions" className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                        Explore Regions in {locationName}
                    </h2>
                    <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                        Each region has its own fostering landscape. Select a region to find local agencies and detailed information.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {childLocations.map((region) => (
                            <Link 
                                key={region.id} 
                                href={`/locations/${location.slug}/${region.slug}`}
                                className="group block p-6 border border-stone-200 rounded-xl hover:border-stone-400 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                        {region.name}
                                    </h3>
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-sm text-stone-500">
                                    {regionDescriptors[region.slug] || "Regional fostering information and agencies"}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. SUPPORT & STANDARDS - TRUST SECTION */}
            <section className="py-20 md:py-28 bg-slate-800">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-12 text-center">
                        Support & Standards
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {supportPoints.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-stone-300">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. WHO THIS PAGE IS FOR */}
            <section className="py-20 md:py-28 bg-stone-50">
                <div className="container-main px-4 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                        Who This Guide Is For
                    </h2>
                    <p className="text-stone-600 text-center mb-8">
                        This page helps orient anyone exploring the UK fostering system.
                    </p>

                    <ul className="space-y-3">
                        {whoItsFor.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-700">
                                <Heart className="w-4 h-4 text-emerald-600" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 9. FAQ - LIMITED, NATIONAL LEVEL */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main px-4 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-semibold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="bg-stone-50 rounded-xl overflow-hidden">
                        {nationalFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-stone-200">
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

            {/* 10. FINAL CTA - QUIET, DIRECTIONAL */}
            <section className="py-20 md:py-28 bg-slate-900 text-white">
                <div className="container-main px-4 max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
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
                        <Button size="lg" variant="outline" className="border-stone-600 text-white hover:bg-stone-800 rounded-full px-8" asChild>
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
