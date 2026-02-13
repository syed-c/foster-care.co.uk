"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Heart, Users, GraduationCap, Home, CheckCircle, Info, Sparkles, MessageCircle, Quote, Activity, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Location, Agency, FAQ } from "@/services/dataService";
import { AgencyListings } from "@/components/location/AgencyListings";
import { ProcessSection } from "./shared/ProcessSection";
import { CTASection } from "./shared/CTASection";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { InteractiveCard } from "./shared/InteractiveCard";
import { SectionIntro } from "./shared/SectionIntro";
import { CollapsibleFAQ } from "./shared/CollapsibleFAQ";

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

export function LocalTemplate({
    location,
    agencies,
    faqs,
    stats
}: LocationPageProps) {
    const locationName = location.name;

    const defaultFaqs = [
        {
            question: `How many children need foster care in ${locationName}?`,
            answer: `Currently, there are over ${stats.childrenInCare.toLocaleString()} children in the ${locationName} area who require stable, loving foster homes. The demand is particularly high for sibling groups and children with additional needs.`
        },
        {
            question: "Can I choose the age of the children I foster?",
            answer: "Yes. During your assessment, we'll discuss your preferences and help you decide which age range and type of fostering (e.g., short-term, long-term) best suits your family and lifestyle."
        },
        {
            question: "What if I have never worked with children before?",
            answer: "Experience is helpful but not essential. We provide comprehensive training and ongoing support to ensure you have all the skills and confidence needed to provide excellent care."
        }
    ];

    const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">

            {/* 1. Local Hero - Hyperlocal & Conversion Focused */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-48 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/generic-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10 px-4">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <ScrollReveal effect="slideRight">
                            <div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                    <Sparkles className="w-3.5 h-3.5 mr-2 inline" />
                                    Community Impact
                                </Badge>

                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
                                    Foster in <br /><span className="text-primary italic">{locationName}</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-medium max-w-xl">
                                    Help us keep <span className="text-white font-black underline decoration-primary/50 underline-offset-4">{locationName}</span> children in their local community.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-18 px-12 text-xl shadow-2xl shadow-primary/30">
                                        Enquire Now
                                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                    <div className="flex items-center gap-4 p-2 bg-white/5 rounded-full border border-white/10 pr-6">
                                        <div className="flex -space-x-3 ml-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Carer" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-tight">
                                            Join {stats.agenciesCount * 12}+ Carers <br /> in {locationName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal effect="slideLeft" className="hidden lg:grid grid-cols-2 gap-6">
                            <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md" hoverLift={true}>
                                <div className="text-4xl lg:text-5xl font-black text-primary mb-2 italic">{stats.childrenInCare.toLocaleString()}</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">{locationName} Kids in Care</div>
                            </InteractiveCard>
                            <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md mt-12" hoverLift={true}>
                                <div className="text-4xl lg:text-5xl font-black text-white mb-2 italic">24/7</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Local Presence</div>
                            </InteractiveCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 2. Keeping Children Local */}
            <section className="py-24 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <ScrollReveal effect="slideRight" className="relative group order-2 lg:order-1">
                            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group-hover:-rotate-1 transition-transform duration-500">
                                <img
                                    src="/images/locations/generic-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
                        </ScrollReveal>

                        <ScrollReveal effect="slideLeft" className="order-1 lg:order-2">
                            <SectionIntro
                                eyebrow="Hyperlocal Impact"
                                heading={<>Keeping Children in <br /><span className="text-primary italic">{locationName}</span></>}
                            />
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                <p>
                                    When a child needs a foster home in {locationName}, our priority is to keep them close to their school, friends, and everything they know. Continuity is vital for their emotional well-being.
                                </p>
                                <p>
                                    By fostering locally, you ensure that a child from {locationName} doesn't have to face the additional trauma of moving to an unfamiliar area.
                                </p>
                            </div>

                            <InteractiveCard className="mt-12 p-8 bg-white border-slate-100 italic" hoverLift={true}>
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Quote className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-800 leading-tight mb-4">
                                            "Knowing my foster child could stay at the same school made all the difference to their confidence during such a big change."
                                        </p>
                                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">— Local {locationName} Carer</span>
                                    </div>
                                </div>
                            </InteractiveCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 3. Local Process Section */}
            <ProcessSection locationName={locationName} />

            {/* 4. Verified Agencies in Area */}
            <section className="py-24 md:py-32 bg-white border-y border-slate-100">
                <div className="container-main">
                    <AgencyListings
                        agencies={agencies}
                        title={`Best Fostering Agencies in ${locationName}`}
                        subtitle={`We've hand-picked the highest rated agencies operating specifically within the ${locationName} area.`}
                        showFeaturedLabel={true}
                        locationName={locationName}
                    />
                </div>
            </section>

            {/* 5. Requirements Checklist */}
            <section className="py-24 md:py-32 bg-background-sand scroll-mt-20">
                <div className="container-main px-4 max-w-5xl mx-auto">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            heading="Can You Foster?"
                            subheading={`Basic requirements for residents of ${locationName} who want to make a difference.`}
                            center={true}
                        />
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                        {[
                            { title: "Spare Bedroom", icon: Home, desc: "A dedicated room for a child." },
                            { title: "Aged 21+", icon: Users, desc: "There is no upper age limit." },
                            { title: "UK Resident", icon: MapPin, desc: "Full-time resident of the UK." },
                            { title: "Desire to Help", icon: Heart, desc: "Genuine passion for local kids." },
                            { title: "Stability", icon: CheckCircle, desc: "Financial and emotional stability." },
                            { title: "Resilience", icon: Activity, desc: "Good health and resilience." }
                        ].map((req, i) => (
                            <ScrollReveal effect="slideUp" delay={i * 0.1} key={i}>
                                <InteractiveCard className="p-8 bg-white border-slate-100" hoverLift={true}>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                        <req.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{req.title}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{req.desc}</p>
                                </InteractiveCard>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal effect="slideUp" delay={0.4} className="mt-12 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 text-primary font-bold text-sm">
                            <Info className="w-4 h-4" />
                            <span>Foundations vary by agency, these are the essentials.</span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 6. FAQ Block */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            heading="Fostering FAQs"
                            subheading={`Find answers to common questions about fostering in the ${locationName} area.`}
                            center={true}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-16">
                        <CollapsibleFAQ
                            items={displayFaqs.map(f => ({
                                question: f.question,
                                answer: f.answer,
                                emoji: "💡"
                            }))}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* 7. Shared CTA Section */}
            <CTASection locationName={locationName} theme="dark" className="bg-white" />
        </div>
    );
}
