"use client";

import { motion, useScroll } from "framer-motion";
import {
    MapPin,
    ArrowRight,
    CheckCircle,
    ChevronRight,
    Activity,
    Users,
    ShieldCheck,
    GraduationCap,
    Heart,
    Building2,
    BadgeCheck,
    HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Location, Agency, FAQ } from "@/services/dataService";
import { StickyNav } from "./shared/StickyNav";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { SectionIntro } from "./shared/SectionIntro";
import { CollapsibleFAQ } from "./shared/CollapsibleFAQ";
import { InteractiveCard } from "./shared/InteractiveCard";
import { useLocationContent, LocationContentData } from "@/hooks/useLocationContent";

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
    const { data: locationContent } = useLocationContent(location.slug);
    
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);

    const c = locationContent?.content;

    const navSections = [
        { id: "intro", label: "Intro" },
        { id: "why-foster", label: "Why Foster" },
        { id: "agency-types", label: "Agencies" },
        { id: "types", label: "Types" },
        { id: "process", label: "Process" },
        { id: "ofsted", label: "Ofsted" },
        { id: "support", label: "Support" },
        { id: "regions", label: "Areas" },
        { id: "glossary", label: "Glossary" },
        { id: "faq", label: "FAQ" },
    ];

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            <StickyNav sections={navSections} />

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full" />
                    <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
                </div>

                <div className="container-main relative z-10 px-4 py-20">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Foster Care Directory
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-10 tracking-tight leading-[1]">
                                {c?.title || locationContent?.title || `Fostering in ${locationName}`}
                            </h1>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
                                {[
                                    { value: `${stats.childrenInCare.toLocaleString()}+`, label: "Children in Care", icon: Users },
                                    { value: `${childLocations.length || stats.boroughs}`, label: "Local Areas", icon: Building2 },
                                    { value: `${stats.agenciesCount}+`, label: "Agencies", icon: Heart }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                                        className="px-8 py-10 rounded-3xl bg-white/5 border border-white/10"
                                    >
                                        <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                                        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 font-black h-14 px-10 text-lg" asChild>
                                    <Link href="/become-a-foster">
                                        {c?.cta?.button_text || "Get Started"}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-14 px-10 text-lg" asChild>
                                    <Link href="#agencies">View Agencies</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
            </section>

            {/* Intro Section */}
            {c?.intro && (
                <section id="intro" className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                {(c.intro.paragraphs || []).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Why Fostering Matters */}
            {c?.why_fostering_matters && (
                <section id="why-foster" className="py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.why_fostering_matters.heading} center />
                        </ScrollReveal>
                        <ScrollReveal effect="slideUp" delay={0.1}>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed mt-12">
                                {(c.why_fostering_matters.paragraphs || []).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Agency Types */}
            {c?.agency_types && (
                <section id="agency-types" className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-5xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.agency_types.heading} subheading={c.agency_types.intro} center />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            <ScrollReveal effect="slideLeft">
                                <div className="p-8 bg-white border-2 border-primary/20 rounded-2xl">
                                    <h3 className="text-2xl font-black mb-4">{c.agency_types.independent.title}</h3>
                                    <p className="text-slate-600 mb-6">{c.agency_types.independent.description}</p>
                                    <ul className="space-y-3">
                                        {(c.agency_types.independent.benefits || []).map((b, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal effect="slideRight">
                                <div className="p-8 bg-slate-50 border rounded-2xl">
                                    <h3 className="text-2xl font-black mb-4">{c.agency_types.local_authority.title}</h3>
                                    <p className="text-slate-600 mb-6">{c.agency_types.local_authority.description}</p>
                                    <ul className="space-y-3">
                                        {(c.agency_types.local_authority.benefits || []).map((b, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* Types of Fostering */}
            {c?.types_of_fostering && (
                <section id="types" className="py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4 max-w-5xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.types_of_fostering.heading} subheading={c.types_of_fostering.intro} center />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-6 mt-12">
                            {(c.types_of_fostering.categories || []).map((cat, i) => (
                                <ScrollRevealItem key={i}>
                                    <InteractiveCard className="p-6 bg-white border h-full">
                                        <h3 className="text-xl font-bold mb-3">{cat.name}</h3>
                                        <p className="text-slate-600">{cat.description}</p>
                                    </InteractiveCard>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How to Become */}
            {c?.how_to_become && (
                <section id="process" className="py-24 md:py-32 bg-slate-900 text-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.how_to_become.heading} subheading={c.how_to_become.intro} center inverted />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            {(c.how_to_become.steps || []).map((step, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-2">{step.name}</h3>
                                            <p className="text-slate-400 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>

                        {c.how_to_become.note && (
                            <p className="text-center text-slate-400 mt-12">{c.how_to_become.note}</p>
                        )}
                    </div>
                </section>
            )}

            {/* Ofsted */}
            {c?.ofsted && (
                <section id="ofsted" className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.ofsted.heading} subheading={c.ofsted.description} center />
                        </ScrollReveal>

                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {(c.ofsted.criteria || []).map((crit, i) => (
                                <div key={i} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium">
                                    {crit}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Support */}
            {c?.support && (
                <section id="support" className="py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4 max-w-5xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.support.heading} subheading={c.support.intro} center />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            {(c.support.categories || []).map((cat, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="p-6 bg-white border rounded-xl">
                                        <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                                        <h3 className="font-bold mb-2">{cat.name}</h3>
                                        <p className="text-slate-600 text-sm">{cat.description}</p>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Regions */}
            {c?.regions && (
                <section id="regions" className="py-24 md:py-32 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.regions.heading} subheading={c.regions.intro} center />
                        </ScrollReveal>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                            {(c.regions.list || []).map((area: string, i: number) => (
                                <ScrollRevealItem key={i}>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span className="font-medium">{area}</span>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Glossary */}
            {c?.glossary && (
                <section id="glossary" className="py-24 md:py-32 bg-slate-50">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.glossary.heading} center />
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-4 mt-12">
                            {(c.glossary.terms || []).map((term, i) => (
                                <ScrollRevealItem key={i}>
                                    <div className="p-4 bg-white border rounded-xl">
                                        <h4 className="font-bold mb-1">{term.term}</h4>
                                        <p className="text-sm text-slate-600">{term.definition}</p>
                                    </div>
                                </ScrollRevealItem>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            {c?.faq && (
                <section id="faq" className="py-24 md:py-32 bg-slate-900 text-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro heading={c.faq.heading} center inverted />
                        </ScrollReveal>

                        <div className="space-y-4 mt-12">
                            {(c.faq.questions || []).map((faq, i) => (
                                <CollapsibleFAQ
                                    key={i}
                                    items={[{ question: faq.question, answer: faq.answer, emoji: "💡" }]}
                                    inverted
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Responsibility */}
            {c?.responsibility && (
                <section className="py-16 bg-white border-t">
                    <div className="container-main px-4 max-w-3xl mx-auto text-center">
                        <h3 className="font-bold mb-4">{c.responsibility.heading}</h3>
                        <p className="text-slate-600">{c.responsibility.paragraph}</p>
                    </div>
                </section>
            )}

            {/* CTA */}
            {c?.cta && (
                <section className="py-24 md:py-32 bg-slate-950 text-white">
                    <div className="container-main px-4 max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">{c.cta.heading}</h2>
                        <p className="text-xl text-slate-300 mb-8">{c.cta.paragraph}</p>
                        <Button size="lg" className="rounded-full bg-primary font-black h-14 px-10" asChild>
                            <Link href="/become-a-foster">
                                {c.cta.button_text}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}
