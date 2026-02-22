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
    Building2,
    GraduationCap,
    Headphones,
    MapPin,
    UsersRound,
    MessageCircle,
    Shield,
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
                                <Link href="/agencies">
                                    Browse Agencies
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

            {/* What It Is Section */}
            {c?.what_it_is && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.what_it_is.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.what_it_is.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Who It Helps Section */}
            {c?.who_it_helps && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.who_it_helps.heading}
                        </h2>
                        {c.who_it_helps.intro && (
                            <p className="text-base text-stone-600 leading-relaxed mb-8">
                                {c.who_it_helps.intro}
                            </p>
                        )}
                        <div className="grid md:grid-cols-1 gap-4">
                            {(c.who_it_helps.groups || []).map((group, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                                    <UsersRound className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                    <span className="text-stone-700">{group}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works Section */}
            {c?.how_it_works && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                            {c.how_it_works.heading}
                        </h2>
                        <div className="space-y-4">
                            {(c.how_it_works.paragraphs || []).map((paragraph, i) => (
                                <p key={i} className="text-base text-stone-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Carer Requirements Section */}
            {c?.carer_requirements && (
                <section className="py-20 md:py-28 bg-emerald-900">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                            {c.carer_requirements.heading}
                        </h2>
                        {c.carer_requirements.intro && (
                            <p className="text-emerald-100 mb-8">
                                {c.carer_requirements.intro}
                            </p>
                        )}
                        <div className="space-y-3">
                            {(c.carer_requirements.requirements || []).map((req, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span className="text-emerald-50">{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Agency Types Section */}
            {c?.agency_types && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.agency_types.heading}
                        </h2>
                        {c.agency_types.intro && (
                            <p className="text-stone-600 mb-10">
                                {c.agency_types.intro}
                            </p>
                        )}
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {c.agency_types.independent && (
                                <div className="p-6 bg-stone-50 rounded-xl border border-stone-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-emerald-600" />
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {c.agency_types.independent.title}
                                        </h3>
                                    </div>
                                    <p className="text-stone-600 mb-4 text-sm">
                                        {c.agency_types.independent.description}
                                    </p>
                                    <div className="space-y-2">
                                        {(c.agency_types.independent.benefits || []).map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                                <span className="text-stone-700 text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {c.agency_types.local_authority && (
                                <div className="p-6 bg-stone-50 rounded-xl border border-stone-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {c.agency_types.local_authority.title}
                                        </h3>
                                    </div>
                                    <p className="text-stone-600 mb-4 text-sm">
                                        {c.agency_types.local_authority.description}
                                    </p>
                                    <div className="space-y-2">
                                        {(c.agency_types.local_authority.benefits || []).map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                                <span className="text-stone-700 text-sm">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* How To Become Section */}
            {c?.how_to_become && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.how_to_become.heading}
                        </h2>
                        {c.how_to_become.intro && (
                            <p className="text-stone-600 mb-6">
                                {c.how_to_become.intro}
                            </p>
                        )}
                        {c.how_to_become.note && (
                            <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg mb-8 inline-block">
                                {c.how_to_become.note}
                            </p>
                        )}

                        <div className="space-y-6">
                            {(c.how_to_become.steps || []).map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold shrink-0">
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

            {/* Ofsted Section */}
            {c?.ofsted && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.ofsted.heading}
                        </h2>
                        <p className="text-stone-600 mb-8">
                            {c.ofsted.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            {(c.ofsted.criteria || []).map((criteria, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                    <span className="text-stone-700 text-sm">{criteria}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Support Section */}
            {c?.support && (
                <section className="py-20 md:py-28 bg-emerald-900">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                            {c.support.heading}
                        </h2>
                        {c.support.intro && (
                            <p className="text-emerald-100 mb-8">
                                {c.support.intro}
                            </p>
                        )}
                        <div className="space-y-4">
                            {(c.support.categories || []).map((category, i) => (
                                <div key={i} className="p-4 bg-emerald-800/50 rounded-lg">
                                    <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                                    <p className="text-emerald-100 text-sm">{category.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Regions Section */}
            {c?.regions && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.regions.heading}
                        </h2>
                        {c.regions.intro && (
                            <p className="text-stone-600 mb-8">
                                {c.regions.intro}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {(c.regions.list || []).map((region, i) => (
                                <span key={i} className="px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-700 text-sm">
                                    {region}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Who Guide Is For Section */}
            {c?.who_guide_is_for && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.who_guide_is_for.heading}
                        </h2>
                        {c.who_guide_is_for.intro && (
                            <p className="text-stone-600 mb-6">
                                {c.who_guide_is_for.intro}
                            </p>
                        )}
                        <div className="grid md:grid-cols-2 gap-3">
                            {(c.who_guide_is_for.audience || []).map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                    <span className="text-stone-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {c?.faq && (
                <section className="py-20 md:py-28 bg-stone-50">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8">
                            {c.faq.heading}
                        </h2>
                        <Accordion type="single" collapsible className="bg-white rounded-xl overflow-hidden">
                            {(c.faq.questions || []).map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="px-6 border-stone-100">
                                    <AccordionTrigger className="text-left text-slate-900 font-medium hover:no-underline">
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
            )}

            {/* Responsibility Section */}
            {c?.responsibility && (
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                            {c.responsibility.heading}
                        </h2>
                        <p className="text-stone-600">
                            {c.responsibility.paragraph}
                        </p>
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
                            <Link href="/agencies">
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
