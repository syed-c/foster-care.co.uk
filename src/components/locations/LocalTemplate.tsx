"use strict";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Shield, Clock, Heart, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
import { AgencyListings } from "@/components/location/AgencyListings";

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

    // Fallback content if empty
    const localEmotionalPitch = `There is an urgent need for foster carers in ${locationName}. Use your spare room to change a local child's story.`;
    const localWhyFoster = `Fostering in ${locationName} allows children to stay connected to their schools, friends, and community. By fostering locally, you provide stability when it's needed most.`;

    const defaultFaqs = [
        {
            question: `How much do foster carers get paid in ${locationName}?`,
            answer: `Foster carers in ${locationName} receive a weekly allowance that covers the cost of caring for a child, plus a professional fee. Amounts vary by agency and the child's needs.`
        },
        {
            question: "Can I foster if I work full time?",
            answer: "Yes, many foster carers work. It depends on your flexibility and the needs of the child."
        },
        {
            question: `Are there local support groups in ${locationName}?`,
            answer: `Yes, ${locationName} has active foster carer support groups that meet regularly for coffee mornings and training sessions.`
        }
    ];

    const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

            {/* 1. Local Hero - Conversion Focused */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/generic-hero.png"
                        alt={`Fostering in ${locationName}`}
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="bg-primary text-white border-none mb-6 px-4 py-1.5 rounded-full font-bold tracking-wide uppercase text-[10px]">
                            <MapPin className="w-3 h-3 mr-2 inline" />
                            Local Opportunity
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.05] text-white">
                            Fostering in <span className="text-primary">{locationName}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-medium">
                            {localEmotionalPitch}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg shadow-lg shadow-primary/20">
                                Enquire Now
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg font-bold">
                                See Local Agencies
                            </Button>
                        </div>
                    </motion.div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                        <h3 className="text-white font-bold text-xl mb-6">Current Need in {locationName}</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Children needing homes</span>
                                <span className="text-2xl font-black text-primary">{Math.ceil(stats.childrenInCare / 30)}+</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-white/60">Active local families</span>
                                <span className="text-2xl font-black text-white">~{Math.ceil(stats.childrenInCare / 40)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Agencies covering area</span>
                                <span className="text-2xl font-black text-white">{stats.agenciesCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster in [Borough] - Hyperlocal */}
            <section className="py-24 bg-white">
                <div className="container-main max-w-4xl mx-auto text-center">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-950">Keep {locationName}'s Children Local</h2>
                    <p className="text-xl text-slate-600 leading-relaxed mb-10">
                        {localWhyFoster}
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <h3 className="font-bold text-lg mb-2">School Stability</h3>
                            <p className="text-slate-500">Local fostering means children don't have to change schools, keeping their education on track.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <h3 className="font-bold text-lg mb-2">Community Roots</h3>
                            <p className="text-slate-500">Maintain vital links with friends, clubs, and extended family within {locationName}.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. How Fostering Works Here */}
            <section className="py-24 bg-background-sand">
                <div className="container-main">
                    <div className="flex items-center gap-4 mb-12">
                        <Clock className="w-8 h-8 text-slate-950" />
                        <h2 className="text-3xl font-black text-slate-950">The Process in {locationName}</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { step: "1", title: "Chat", desc: "15 min call" },
                            { step: "2", title: "Visit", desc: "Home consultation" },
                            { step: "3", title: "Train", desc: "Local workshops" },
                            { step: "4", title: "Foster", desc: "First placement" }
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                                <span className="text-4xl font-black text-primary/20 mb-4">{s.step}</span>
                                <h3 className="text-xl font-bold mb-1">{s.title}</h3>
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Local Agencies */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container-main">
                    <AgencyListings
                        agencies={agencies}
                        title={`Agencies covering ${locationName}`}
                        subtitle={`Compare vetted agencies that support carers in ${locationName}.`}
                        showFeaturedLabel={true}
                        locationName={locationName}
                    />
                </div>
            </section>

            {/* 5. Can I Foster in [Borough]? */}
            <section className="py-24 bg-slate-950 text-white">
                <div className="container-main grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Requirements in {locationName}</h2>
                        <p className="text-white/60 text-lg mb-8">
                            Most people in {locationName} can foster. You need a spare room and the passion to care.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-primary" /></div>
                                <span className="font-bold">Spare bedroom required</span>
                            </li>
                            <li className="flex gap-4 items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-primary" /></div>
                                <span className="font-bold">Over 21 years old</span>
                            </li>
                            <li className="flex gap-4 items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-primary" /></div>
                                <span className="font-bold">Permanent UK resident</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/10 p-8 rounded-3xl border border-white/5">
                        <HelpCircle className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Housing in {locationName}</h3>
                        <p className="text-white/60 mb-4">
                            We know housing in {locationName} can be tight. As long as you have a stable tenancy and a private bedroom for the child, you can foster.
                        </p>
                    </div>
                </div>
            </section>


            {/* 6. FAQ: Foster Care in [Borough] */}
            <section className="py-24 bg-white">
                <div className="container-main max-w-3xl">
                    <h2 className="text-3xl font-black mb-12 text-slate-950 text-center">Local Questions</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                        {displayFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-100 rounded-2xl px-6">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline text-left">
                                    {faq.question.replace("[Location]", locationName)}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 pb-4">
                                    {faq.answer.replace("[Location]", locationName)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 7. Big CTA Block */}
            <section className="py-24 bg-primary text-white text-center">
                <div className="container-main max-w-4xl">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to Start Your Fostering Journey in {locationName}?</h2>
                    <p className="text-xl text-white/80 mb-12 font-medium">
                        Take the first step today. We'll connect you with the best local agencies to guide you through the process.
                    </p>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black h-16 px-12 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                        Get Started in {locationName}
                    </Button>
                </div>
            </section>
        </div>
    );
}
