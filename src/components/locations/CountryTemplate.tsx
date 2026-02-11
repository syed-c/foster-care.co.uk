"use strict";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, CheckCircle, Shield, Info, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";

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

export function CountryTemplate({
    location,
    childLocations,
    faqs,
    stats
}: LocationPageProps) {
    const locationName = location.name;

    // Default National Content
    const emotionalPitch = "Join the heart of fostering in England. With thousands of children requiring care every day, your decision to foster can create a legacy of love and opportunity for generations to come.";
    const whyFosterParagraph = "England's foster care system is a vital safety net for thousands of vulnerable young people. From major urban hubs to rural communities, the demand for high-quality, professional foster care is constant. By fostering in England, you become part of a nationwide effort to ensure every child has access to a safe and nurturing home. The network of support available to English foster carers is world-class, offering comprehensive training and competitive allowances.";

    const defaultFaqs = [
        {
            question: "What is the process to foster in England?",
            answer: "The process typically takes 4-6 months and involves an initial enquiry, home visits, a comprehensive assessment (Form F), preparation training, and approval by a fostering panel."
        },
        {
            question: "Do I need to own my home?",
            answer: "No, you can foster whether you rent or own, as long as you have a stable tenancy and a spare bedroom for the foster child."
        },
        {
            question: "What support is available nationally?",
            answer: "In England, all foster carers receive a weekly allowance, dedicated social worker support, and access to ongoing training and peer support groups."
        }
    ];

    const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

            {/* 1. Emotive Hero - Country Level */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/england-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 px-4 py-1.5 rounded-full font-bold tracking-wide uppercase text-[10px]">
                                <MapPin className="w-3 h-3 mr-2 inline" />
                                National Coverage
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter leading-[1.05] text-white">
                                Foster Care in <span className="text-primary">{locationName}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                                {emotionalPitch}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-5xl font-black text-primary">{stats.childrenInCare}+</span>
                                    <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Children in Care</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-5xl font-black text-primary">{childLocations.length}</span>
                                    <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Regions Covered</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg shadow-lg shadow-primary/20">
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-slate-950 hover:bg-slate-100 h-14 px-8 text-lg font-bold border-0 shadow-lg">
                                    Browse Regions
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster Nationally */}
            <section className="py-24 md:py-32 bg-background-sand">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950 leading-tight">
                                Why Foster in {locationName}?
                            </h2>
                            <p className="text-lg text-slate-700/80 leading-relaxed mb-6">
                                {whyFosterParagraph}
                            </p>
                            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-slate-600 my-8 bg-white/50 rounded-r-xl">
                                "Fostering has changed our lives. Knowing we are part of a national community of carers gives us strength every day."
                                <footer className="text-sm font-bold text-slate-900 mt-2">— Sarah & Tom, Foster Carers in England</footer>
                            </blockquote>
                        </motion.div>
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <img
                                src="/images/locations/england-hero.png"
                                alt={`Fostering in ${locationName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Getting Started Guide */}
            <section className="py-24 bg-white">
                <div className="container-main text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-950">How to Become a Foster Carer</h2>
                    <div className="mt-8 relative h-64 md:h-80 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm mx-auto max-w-4xl">
                        <img
                            src="/images/locations/steps-visual.png"
                            alt="Fostering Steps Visual"
                            className="w-full h-full object-contain bg-[#f3f0e9]"
                        />
                    </div>
                </div>
            </section>

            {/* 4. Requirements Checklist */}
            <section className="py-24 bg-background-sand">
                <div className="container-main">
                    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 md:p-16 shadow-xl border border-slate-100">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-950">Can I Foster in {locationName}?</h2>
                            <p className="text-slate-500 text-lg">National eligibility criteria overview.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                            {[
                                "At least 21 years of age",
                                "Spare bedroom for a child",
                                "British citizenship or indefinite leave to remain",
                                "Time to care for a child",
                                "Good health and fitness",
                                "No disqualifying criminal convictions"
                            ].map((req, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-slate-700 font-bold text-lg">{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Local Support Overview (National Level) */}
            <section className="py-24 bg-slate-950 text-white">
                <div className="container-main text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">National Support Network</h2>
                    <p className="max-w-2xl mx-auto text-white/60 mb-12 text-lg">
                        We connect you with agencies across the country providing 24/7 support, training hubs, and peer mentoring.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Training", desc: "Comprehensive national training standards." },
                            { title: "Allowances", desc: "Standardized minimum allowances plus agency uplifts." },
                            { title: "Community", desc: "Access to thousands of other carers." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-white/50">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Regions Grid */}
            <section className="py-24 bg-white">
                <div className="container-main">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-950 text-center">Explore Regions in {locationName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {childLocations.map((region) => (
                            <Link key={region.id} href={`/locations/${location.slug}/${region.slug}`} className="group relative overflow-hidden rounded-3xl aspect-[4/3] bg-slate-100">
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-primary transition-colors">{region.name}</h3>
                                    <span className="text-white/80 font-medium flex items-center gap-2">
                                        Explore Region <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQ + CTA */}
            <section className="py-24 bg-background-sand">
                <div className="container-main max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-950 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                        {displayFaqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-b-0 rounded-2xl bg-white px-6 py-2">
                                <AccordionTrigger className="text-lg font-bold hover:no-underline">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-base">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-20 p-12 rounded-[3rem] bg-slate-950 text-white text-center">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Start Your Journey Today</h2>
                        <Button size="lg" className="rounded-full bg-primary text-white font-bold h-14 px-8 text-lg hover:scale-105 transition-transform">
                            Enquire Now
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
