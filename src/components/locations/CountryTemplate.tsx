"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, CheckCircle, Info, MessageCircle, ChevronRight, Activity, Users, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
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

export function CountryTemplate({
    location,
    childLocations,
    faqs,
    stats
}: LocationPageProps) {
    const locationName = location.name;

    // Default National Content
    const emotionalPitch = `Lead the way in fostering excellence across ${locationName}. With over ${stats.childrenInCare.toLocaleString()} children currently in care, your decision to foster is a powerful commitment to the next generation.`;
    const whyFosterParagraph = `${locationName}'s foster care system is one of the most robust in the world, offering unparalleled support and training for carers. From bustling cities to quiet coastal towns, the demand for nurturing homes remains high. By choosing to foster here, you're joining a dedicated national network of professionals and families committed to providing every child with the stability and love they deserve. The national framework ensures you receive competitive allowances, comprehensive training, and 24/7 support throughout your journey.`;

    const defaultFaqs = [
        {
            question: `What is the national process for fostering in ${locationName}?`,
            answer: `The process in ${locationName} is standardized and highly professional. It typically takes 4-6 months, including an initial enquiry, home visits, a comprehensive 'Form F' assessment, and finally approval by a fostering panel.`
        },
        {
            question: "Do I need a specific background to foster?",
            answer: "No. We welcome carers from all walks of life. Whether you are single, married, in a same-sex relationship, or have your own children, what matters most is your ability to provide a safe and loving home."
        },
        {
            question: "What financial support is available nationally?",
            answer: `In ${locationName}, all foster carers are entitled to a weekly allowance that covers the child's living costs. Many agencies also provide an additional professional fee to recognize the skill and dedication of the carer.`
        }
    ];

    const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">

            {/* 1. National Hero - High Impact */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/england-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                <Activity className="w-3.5 h-3.5 mr-2 inline" />
                                National Fostering Overview
                            </Badge>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
                                Fostering in <span className="text-primary italic">{locationName}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                {emotionalPitch}
                            </p>

                            {/* National Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-14 max-w-3xl mx-auto">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="text-3xl md:text-5xl font-black text-primary mb-1">{stats.childrenInCare.toLocaleString()}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Children in Care</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">{childLocations.length}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Regions Covered</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm col-span-2 md:col-span-1">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.agenciesCount}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Verified Agencies</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 text-xl shadow-2xl shadow-primary/20">
                                    Start Your Journey
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-16 px-10 text-xl font-black">
                                    Browse Regions
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster Nationally - Long-form SEO */}
            <section className="py-24 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <div className="w-10 h-px bg-primary" />
                                National Impact
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter text-slate-950 leading-[1.1]">
                                Why Foster in <br /><span className="text-primary">{locationName}?</span>
                            </h2>
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                <p>{whyFosterParagraph}</p>
                                <p>Nationwide policies ensure that every foster carer has access to high-quality therapeutic support, legal protection, and a voice within the fostering community.</p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <ShieldCheck className="w-10 h-10 text-primary" />
                                    <h3 className="font-bold text-slate-950 text-lg">National Standards</h3>
                                    <p className="text-slate-500 text-sm">Strict quality control across all agencies.</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Users className="w-10 h-10 text-primary" />
                                    <h3 className="font-bold text-slate-950 text-lg">Peer Network</h3>
                                    <p className="text-slate-500 text-sm">Tens of thousands of carers nationwide.</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                <img
                                    src="/images/locations/england-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
                            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-0" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. National Process Section */}
            <ProcessSection locationName={locationName} />

            {/* 4. Support available countrywide */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Support Across {locationName}</h2>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed">
                            No matter where you are in {locationName}, you are supported by a world-class network of dedicated professionals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "24/7 Helpline",
                                desc: "Round-the-clock access to experienced social workers who can offer advice and support when you need it most.",
                                icon: MessageCircle
                            },
                            {
                                title: "Training Hubs",
                                desc: "Local and regional training centers providing specialized workshops in therapeutic care and child development.",
                                icon: GraduationCap
                            },
                            {
                                title: "Financial Security",
                                desc: "Competitive national allowances plus additional benefits, including tax exemptions and national insurance credits.",
                                icon: ShieldCheck
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-50">
                                    <item.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-slate-950">{item.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Regions Browser UI */}
            <section className="py-24 md:py-32 bg-slate-950 text-white rounded-[4rem] mx-4 my-8">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">Explore Regions in <br /><span className="text-primary italic">{locationName}</span></h2>
                            <p className="text-xl text-white/60 font-medium leading-relaxed">
                                Start your local journey by exploring the unique foster care landscapes across {locationName}'s key regions.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-8xl font-black text-white/5 select-none">{locationName.slice(0, 3).toUpperCase()}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {childLocations.map((region, i) => (
                            <motion.div
                                key={region.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/locations/${location.slug}/${region.slug}`} className="group block relative overflow-hidden rounded-[3rem] aspect-[4/3] bg-slate-800 border border-white/5">
                                    <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors z-10" />
                                    <img
                                        src="/images/locations/generic-hero.png"
                                        alt={region.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-8 right-8 z-20">
                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all">
                                            <ArrowRight className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-10 left-10 right-10 z-20">
                                        <div className="text-[10px] uppercase tracking-widest text-primary font-black mb-2 flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-primary" />
                                            Regional Hub
                                        </div>
                                        <h3 className="text-3xl font-black text-white leading-tight">{region.name}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Block */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Frequently Asked Questions</h2>
                        <p className="text-xl text-slate-600 font-medium">Common questions about fostering on a national level.</p>
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
