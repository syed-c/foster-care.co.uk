"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    ShieldCheck,
    Heart,
    HelpCircle,
    BookOpen,
    Scale,
    Clock,
    Home,
    Baby,
    Stethoscope,
    HeartHandshake,
    Users,
    Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServiceContent } from "@/hooks/useServiceContent";

interface ServicePageProps {
    locationSlug: string;
    serviceSlug: string;
    locationName: string;
}

const serviceInfo: Record<string, { title: string; description: string; icon: any }> = {
    "short-term": {
        title: "Short-Term Fostering",
        description: "Temporary care for children for periods ranging from a few days to several months.",
        icon: Clock
    },
    "long-term": {
        title: "Long-Term Fostering",
        description: "Ongoing care for children who cannot return to their birth family.",
        icon: Home
    },
    "emergency": {
        title: "Emergency Fostering",
        description: "Immediate, same-day placements for children in crisis situations.",
        icon: HeartHandshake
    },
    "respite": {
        title: "Respite Fostering",
        description: "Short breaks for children and their main foster families.",
        icon: Users
    },
    "parent-child": {
        title: "Parent & Child Fostering",
        description: "Supporting a parent and their child together in a family home.",
        icon: Baby
    },
    "therapeutic": {
        title: "Therapeutic Fostering",
        description: "Specialist care for children with complex emotional and behavioral needs.",
        icon: Stethoscope
    }
};

export function ServiceTemplate({ locationSlug, serviceSlug, locationName }: ServicePageProps) {
    const { data: serviceContent, isLoading } = useServiceContent(locationSlug, serviceSlug);
    
    const info = serviceInfo[serviceSlug] || { title: serviceSlug, description: "", icon: Heart };
    const c = serviceContent?.content;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
            </div>
        );
    }

    if (!serviceContent || !c) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-5xl font-bold text-stone-200 mb-4">404</h1>
                    <h2 className="text-xl font-semibold text-stone-800 mb-3">Content not found</h2>
                    <p className="text-stone-600 mb-6">
                        We couldn't find content for this service in {locationName} yet.
                    </p>
                    <Link href="/locations/england">
                        <Button variant="outline">Browse locations</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Hero Section */}
            <section className="relative py-28 md:py-36 lg:py-44 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative container-main px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <info.icon className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400 uppercase tracking-wider">{info.title}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            {c?.title || `${info.title} in ${locationName}`}
                        </h1>
                        
                        {(c?.intro?.paragraphs || []).map((paragraph, i) => (
                            <p key={i} className="text-lg text-stone-300 leading-relaxed mb-4 max-w-2xl">
                                {paragraph}
                            </p>
                        ))}

                        <div className="flex flex-wrap gap-4 mt-10">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
                                <Link href="/become-a-foster">
                                    Find Agencies
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Termination */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 text-slate-900">
                        <path d="M0 80C240 80 480 80 720 40C960 0 1200 0 1440 40L1440 80H0Z" fill="currentColor"/>
                    </svg>
                </div>
            </section>

            {/* What is it section */}
            {c?.what_is_it && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.what_is_it.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.what_is_it.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Who is it for section */}
            {c?.who_is_it_for && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.who_is_it_for.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.who_is_it_for.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Requirements section */}
            {c?.requirements && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.requirements.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.requirements.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Benefits section */}
            {c?.benefits && (
                <section className="py-20 md:py-28 bg-emerald-900">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                            {c.benefits.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.benefits.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-emerald-100 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Process section */}
            {c?.process && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8">
                            {c.process.heading}
                        </h2>

                        <div className="space-y-8">
                            {(c.process.steps || []).map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-800 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-semibold text-slate-900 mb-1">{step.name}</h3>
                                        <p className="text-sm text-stone-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Support section */}
            {c?.support && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.support.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.support.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Agencies section */}
            {c?.agencies && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.agencies.heading}
                        </h2>
                        <p className="text-stone-600 mb-8">
                            {c.agencies.paragraph}
                        </p>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8" asChild>
                            <Link href="/agencies">
                                Browse Agencies
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            {c?.cta && (
                <section className="py-20 md:py-28 bg-slate-900 text-white">
                    <div className="container-main px-4 max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            {c.cta.heading}
                        </h2>
                        <p className="text-stone-300 mb-8 max-w-lg mx-auto">
                            {c.cta.paragraph}
                        </p>
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
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
