"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Heart, Users, GraduationCap, Home, CheckCircle, Info, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency, FAQ } from "@/services/dataService";
import { AgencyListings } from "@/components/location/AgencyListings";
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
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/generic-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                <Sparkles className="w-3.5 h-3.5 mr-2 inline" />
                                Community Impact
                            </Badge>

                            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
                                Foster in <span className="text-primary italic">{locationName}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-medium">
                                Help us keep <span className="text-white font-black underline decoration-primary/50 underline-offset-4">{locationName}</span> children in their local community. Your spare room can change a life today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 text-xl shadow-2xl shadow-primary/20">
                                    Enquire Now
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Carer" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest leading-tight">
                                        Join {stats.agenciesCount * 15}+ carers <br /> in {locationName}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="hidden lg:grid grid-cols-2 gap-6">
                            <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="text-4xl font-black text-primary mb-2">{stats.childrenInCare.toLocaleString()}</div>
                                <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{locationName} Children in Care</div>
                            </div>
                            <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm mt-12">
                                <div className="text-4xl font-black text-white mb-2">24/7</div>
                                <div className="text-xs uppercase tracking-widest text-white/40 font-bold">Local Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Keeping Children Local - Peer-to-peer/Emotional appeal */}
            <section className="py-24 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                <img
                                    src="/images/locations/generic-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <div className="w-10 h-px bg-primary" />
                                Hyperlocal Impact
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter text-slate-950 leading-[1.1]">
                                Keeping Children in <span className="text-primary italic">{locationName}</span>
                            </h2>
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                <p>
                                    When a child needs a foster home in {locationName}, our priority is to keep them close to their school, friends, and everything they know. This continuity is vital for their emotional well-being and long-term success.
                                </p>
                                <p>
                                    By fostering locally, you are helping to maintain the fabric of our community. You're ensuring that a child from {locationName} doesn't have to face the additional trauma of moving to a completely unfamiliar area.
                                </p>
                            </div>

                            <div className="mt-12 flex items-center gap-6 p-6 rounded-3xl bg-white shadow-sm border border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm font-bold text-slate-600 leading-snug italic">
                                    "Knowing my foster child could stay at the same school made all the difference to their confidence during such a big change."
                                    <span className="block not-italic text-slate-400 mt-1">— Local {locationName} Carer</span>
                                </p>
                            </div>
                        </motion.div>
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
            <section className="py-24 md:py-32 bg-background-sand">
                <div className="container-main max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Can You Foster?</h2>
                        <p className="text-xl text-slate-600 font-medium">Basic requirements for residents of {locationName}.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "A spare bedroom in your home",
                            "Aged 21 or over",
                            "Full-time resident of the UK",
                            "A genuine desire to help local children",
                            "Stability in your own life",
                            "Good health and emotional resilience"
                        ].map((req, i) => (
                            <div key={i} className="flex items-center gap-4 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="text-slate-800 font-bold text-lg">{req}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-medium">
                            <Info className="w-4 h-4 inline mr-2 text-primary" />
                            Every agency has their own specific criteria, but these are the foundations.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. FAQ Block */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Fostering FAQs</h2>
                        <p className="text-xl text-slate-600 font-medium">Find answers to common questions in {locationName}.</p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                        {displayFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-none rounded-3xl bg-slate-50 px-8 py-2 overflow-hidden hover:bg-slate-100 transition-colors">
                                <AccordionTrigger className="text-xl font-bold hover:no-underline text-slate-950 py-6 text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-lg leading-relaxed pb-8 font-medium">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 7. Shared CTA Section */}
            <CTASection locationName={locationName} theme="dark" className="bg-white" />
        </div>
    );
}
