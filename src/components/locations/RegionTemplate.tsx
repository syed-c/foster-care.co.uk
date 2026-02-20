"use client";

import { motion } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    CheckCircle,
    ShieldCheck,
    Heart,
    Users,
    Building2,
    HelpCircle,
    BookOpen,
    Scale,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRef, useState } from "react";
import { Location, Agency, FAQ } from "@/services/dataService";
import { useLocationContent } from "@/hooks/useLocationContent";

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
    };
}

export function RegionTemplate({
    location,
    childLocations,
    agencies,
    stats,
}: LocationPageProps) {
    const { data: locationContent, isLoading } = useLocationContent(location.slug);
    
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const howItWorksRef = useRef<HTMLDivElement>(null);

    const c = locationContent?.content;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    // 404 if no content
    if (!locationContent || !c) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-5xl font-bold text-slate-200 mb-4">404</h1>
                    <h2 className="text-xl font-semibold text-slate-800 mb-3">Page not found</h2>
                    <p className="text-slate-600 mb-6">
                        We couldn't find content for this region yet.
                    </p>
                    <Link href="/locations">
                        <Button variant="outline">Browse all locations</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const scrollToHowItWorks = () => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative py-24 md:py-32 lg:py-40 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            {c?.title || locationContent?.title || `Fostering in ${locationName}`}
                        </h1>
                        
                        {(c?.intro?.paragraphs || []).map((paragraph, i) => (
                            <p key={i} className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
                                {paragraph}
                            </p>
                        ))}

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 rounded-full px-8" asChild>
                                <Link href="/become-a-foster">
                                    Browse Agencies
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="text-slate-600 hover:text-slate-900"
                                onClick={scrollToHowItWorks}
                            >
                                How fostering works in {locationName}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. WHY FOSTERING MATTERS */}
            {c?.why_fostering_matters && (
                <section className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <div className="border-t-2 border-slate-200 pt-8">
                            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                                {c.why_fostering_matters.heading}
                            </h2>
                            <div className="space-y-4">
                                {(c.why_fostering_matters.paragraphs || []).map((paragraph, i) => (
                                    <p key={i} className="text-base text-slate-600 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. UNDERSTANDING FOSTERING NEEDS */}
            {c?.fostering_needs && (
                <section className="py-20 md:py-24 bg-slate-50">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                                    {c.fostering_needs.heading}
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {(c.fostering_needs.paragraphs || []).map((paragraph, i) => (
                                    <p key={i} className="text-base text-slate-600 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. AGENCY TYPES COMPARISON */}
            {c?.agency_types && (
                <section className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                            {c.agency_types.heading}
                        </h2>
                        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
                            {c.agency_types.intro}
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Independent Agencies */}
                            <div className="p-8 bg-slate-50 rounded-2xl">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    {c.agency_types.independent.title}
                                </h3>
                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                    {c.agency_types.independent.description}
                                </p>
                                <ul className="space-y-3">
                                    {(c.agency_types.independent.benefits || []).map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Local Authority */}
                            <div className="p-8 bg-slate-50 rounded-2xl">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    {c.agency_types.local_authority.title}
                                </h3>
                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                    {c.agency_types.local_authority.description}
                                </p>
                                <ul className="space-y-3">
                                    {(c.agency_types.local_authority.benefits || []).map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 5. TYPES OF FOSTERING */}
            {c?.types_of_fostering && (
                <section className="py-20 md:py-24 bg-slate-50">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                            {c.types_of_fostering.heading}
                        </h2>
                        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
                            {c.types_of_fostering.intro}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {(c.types_of_fostering.categories || []).map((category, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl">
                                    <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{category.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. HOW TO BECOME A FOSTER CARER */}
            {c?.how_to_become && (
                <section ref={howItWorksRef} className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                            {c.how_to_become.heading}
                        </h2>
                        <p className="text-slate-600 mb-10">
                            {c.how_to_become.intro}
                        </p>

                        <div className="space-y-8">
                            {(c.how_to_become.steps || []).map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-900 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-semibold text-slate-900 mb-1">{step.name}</h3>
                                        <p className="text-sm text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {c.how_to_become.note && (
                            <p className="mt-8 text-sm text-slate-500 italic border-l-2 border-slate-200 pl-4">
                                {c.how_to_become.note}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* 7. OFSTED & QUALITY */}
            {c?.ofsted && (
                <section className="py-20 md:py-24 bg-slate-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Scale className="w-6 h-6 text-slate-700" />
                            <h2 className="text-2xl font-semibold text-slate-900">
                                {c.ofsted.heading}
                            </h2>
                        </div>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            {c.ofsted.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {(c.ofsted.criteria || []).map((criteria, i) => (
                                <span key={i} className="px-4 py-2 bg-white rounded-full text-sm text-slate-700">
                                    {criteria}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 8. SUPPORT FOR CARERS */}
            {c?.support && (
                <section className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3 text-center">
                            {c.support.heading}
                        </h2>
                        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
                            {c.support.intro}
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {(c.support.categories || []).map((category, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-xl">
                                    <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{category.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 9. AREAS COVERED */}
            {c?.regions && (
                <section className="py-20 md:py-24 bg-slate-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
                            {c.regions.heading}
                        </h2>
                        <p className="text-slate-600 text-center mb-8">
                            {c.regions.intro}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2">
                            {(c.regions.list || []).map((area, i) => {
                                const areaName = typeof area === 'object' ? area.county : area;
                                return (
                                    <span key={i} className="px-4 py-2 bg-white rounded-full text-sm text-slate-700">
                                        {areaName}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* 10. WHO THIS GUIDE IS FOR */}
            {c?.who_guide_is_for && (
                <section className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                            {c.who_guide_is_for.heading}
                        </h2>
                        <p className="text-slate-600 text-center mb-8">
                            {c.who_guide_is_for.intro}
                        </p>

                        <ul className="space-y-3">
                            {(c.who_guide_is_for.audience || []).map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700">
                                    <Heart className="w-4 h-4 text-slate-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* 11. GLOSSARY (Accordion) */}
            {c?.glossary && (
                <section className="py-20 md:py-24 bg-slate-50">
                    <div className="container-main px-4 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="w-5 h-5 text-slate-700" />
                            <h2 className="text-xl font-semibold text-slate-900">
                                {c.glossary.heading}
                            </h2>
                        </div>

                        <Accordion type="single" collapsible className="bg-white rounded-xl overflow-hidden">
                            {(c.glossary.terms || []).map((term, i) => (
                                <AccordionItem key={i} value={`term-${i}`} className="px-6 border-slate-100">
                                    <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">
                                        {term.term}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        {term.definition}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
            )}

            {/* 12. FAQ (Accordion) */}
            {c?.faq && (
                <section className="py-20 md:py-24 bg-white">
                    <div className="container-main px-4 max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="w-5 h-5 text-slate-700" />
                            <h2 className="text-xl font-semibold text-slate-900">
                                {c.faq.heading}
                            </h2>
                        </div>

                        <Accordion type="single" collapsible className="bg-slate-50 rounded-xl overflow-hidden">
                            {(c.faq.questions || []).map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-slate-200">
                                    <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
            )}

            {/* 13. SAFEGUARDING & ROLE */}
            {c?.responsibility && (
                <section className="py-16 bg-slate-100">
                    <div className="container-main px-4 max-w-2xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-slate-600" />
                            <h2 className="text-lg font-semibold text-slate-900">
                                {c.responsibility.heading}
                            </h2>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {c.responsibility.paragraph}
                        </p>
                    </div>
                </section>
            )}

            {/* 14. FINAL CTA */}
            {c?.cta && (
                <section className="py-20 md:py-24 bg-slate-900 text-white">
                    <div className="container-main px-4 max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            {c.cta.heading}
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                            {c.cta.paragraph}
                        </p>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8" asChild>
                            <Link href="/become-a-foster">
                                {c.cta.button_text}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}
