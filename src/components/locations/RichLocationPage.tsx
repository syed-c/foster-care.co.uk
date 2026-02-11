"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Shield,
    Users,
    MapPin,
    CheckCircle,
    ArrowRight,
    MessageCircle,
    Info,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency, FAQ } from "@/services/dataService";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RichLocationPageProps {
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

export function RichLocationPage({
    location,
    childLocations,
    path,
    faqs,
    agencies,
    stats
}: RichLocationPageProps) {
    const locationName = location.name;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

            {/* 1. Hero / Header */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-foreground text-background">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 px-4 py-1.5 rounded-full font-bold tracking-wide uppercase text-[10px]">
                                Fostering in {locationName}
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
                                Foster Care in <span className="text-primary">{locationName}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-background/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Make a life-changing difference to children and young people in {locationName}. Start your rewarding journey today with support and training every step of the way.
                            </p>

                            {/* Regional Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-4xl font-black text-primary">{stats.childrenInCare}+</span>
                                    <span className="text-xs uppercase tracking-widest text-background/50 font-bold">Children in Care</span>
                                </div>
                                <div className="w-px h-10 bg-background/10 hidden md:block" />
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-4xl font-black text-primary">{stats.boroughs}</span>
                                    <span className="text-xs uppercase tracking-widest text-background/50 font-bold">Local Districts</span>
                                </div>
                                <div className="w-px h-10 bg-background/10 hidden md:block" />
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-4xl font-black text-primary">{stats.agenciesCount}</span>
                                    <span className="text-xs uppercase tracking-widest text-background/50 font-bold">Active Agencies</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" variant="hero" className="w-full sm:w-auto rounded-full group">
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-background/20 text-background hover:bg-background/10">
                                    View Local Agencies
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster in [Location] */}
            <section className="py-20 md:py-28 bg-background-sand">
                <div className="container-main">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-primary font-bold uppercase tracking-widest text-xs">The Impact</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 tracking-tight text-foreground -ml-1">
                                Why Foster in {locationName}?
                            </h2>

                            <div className="prose prose-lg text-foreground/70 leading-relaxed space-y-6">
                                <p>
                                    The need for dedicated foster carers in {locationName} has never been greater. With a diverse and growing population, local authorities and independent agencies are constantly looking for individuals who can provide a safe, stable, and nurturing environment for children from all backgrounds. Fostering in this region allows you to stay connected to your community while making a profound impact on a young person's life during their most vulnerable moments.
                                </p>
                                <p>
                                    As part of the {locationName} fostering community, you'll join a network of passionate professionals and fellow carers dedicated to excellence in child care. The local landscape offers a unique mix of urban and community settings, requiring a wide range of foster placements, from short-term emergency care to permanent long-term homes.
                                </p>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    "High demand for sibling groups and older children",
                                    "Excellent local support networks and peer groups",
                                    "Access to specialist therapeutic training",
                                    "Competitive allowances reflecting local cost of living"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-foreground/80 font-medium">
                                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-card">
                                <img
                                    src={`https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop`}
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -left-6 md:-left-12 p-6 rounded-3xl bg-white shadow-elevated border border-primary/10 max-w-xs animate-float">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <p className="font-black text-foreground">Urgent Need</p>
                                </div>
                                <p className="text-sm text-foreground/60 leading-relaxed">
                                    We are currently seeking {stats.childrenInCare / 10}+ new foster families in {locationName} this year to meet the rising demand.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Local Support & Agencies */}
            <section className="py-20 md:py-28 bg-white">
                <div className="container-main">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 rounded-full px-4 py-1 font-bold text-xs">
                            <Shield className="w-3 h-3 mr-2" />
                            Trusted Support
                        </Badge>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-foreground">
                            Local Support & Agency Network
                        </h2>
                        <p className="text-lg text-foreground/60 leading-relaxed">
                            When you choose to foster in {locationName}, you're never alone. Our network of verified agencies provides comprehensive wrappers of support tailored to the specific needs of the local area.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "24/7 Local Support",
                                desc: `Access to on-call social workers and support groups across the ${stats.boroughs} local districts in ${locationName}.`
                            },
                            {
                                icon: Info,
                                title: "Specialist Training",
                                desc: "Localised training sessions covering everything from basic care skills to advanced therapeutic fostering."
                            },
                            {
                                icon: MapPin,
                                title: "Community Matching",
                                desc: "We prioritize keeping children in their local schools and near their friendship groups whenever possible."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-background-sand/50 border border-foreground/5 hover:border-primary/20 transition-all hover:shadow-soft group">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
                                <p className="text-foreground/60 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Boroughs/Districts */}
            {childLocations.length > 0 && (
                <section className="py-20 md:py-28 bg-foreground text-background">
                    <div className="container-main">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="max-w-xl">
                                <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                    Local Coverage
                                </Badge>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                                    Areas We Serve in {locationName}
                                </h2>
                                <p className="text-background/50 text-lg">
                                    Explore fostering opportunities in specific boroughs and districts across the region.
                                </p>
                            </div>
                            <Button variant="outline" className="rounded-full border-background/20 text-background hover:bg-background/10">
                                View All {childLocations.length} Areas
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {childLocations.map((child, i) => (
                                <Link
                                    key={child.id}
                                    href={`/locations/${location.slug}/${child.slug}`}
                                    className="group flex items-center justify-between p-5 rounded-2xl bg-background/5 border border-background/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
                                >
                                    <span className="font-bold text-sm md:text-base pr-2 truncate">{child.name}</span>
                                    <ChevronRight className="w-4 h-4 text-background/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. FAQ Section */}
            <section className="py-20 md:py-28 bg-background-sand">
                <div className="container-main">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-foreground">
                                Fostering FAQ
                            </h2>
                            <p className="text-lg text-foreground/60">
                                Common questions about the fostering process in {locationName}.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.length > 0 ? faqs.map((faq, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border-none rounded-3xl bg-white shadow-soft px-6 py-2"
                                >
                                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-4">
                                        {faq.question.replace("[Location]", locationName)}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-foreground/60 leading-relaxed text-base pb-6">
                                        {faq.answer.replace("[Location]", locationName)}
                                    </AccordionContent>
                                </AccordionItem>
                            )) : (
                                <>
                                    <AccordionItem value="item-1" className="border-none rounded-3xl bg-white shadow-soft px-6 py-2">
                                        <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-4">
                                            How long does the application process take in {locationName}?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-foreground/60 leading-relaxed text-base pb-6">
                                            On average, the process to become a foster carer in {locationName} takes between 4 to 6 months. This includes training, home assessments, and panel approval.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="border-none rounded-3xl bg-white shadow-soft px-6 py-2">
                                        <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-4">
                                            What support is available for foster carers locally?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-foreground/60 leading-relaxed text-base pb-6">
                                            Carers in {locationName} receive 24/7 support, a dedicated supervising social worker, weekly allowances, and access to local peer support networks.
                                        </AccordionContent>
                                    </AccordionItem>
                                </>
                            )}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* 6. CTA & Contact */}
            <section className="section-padding bg-background-sand relative overflow-hidden">
                <div className="container-main">
                    <motion.div
                        initial={false}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-[3rem] bg-foreground text-background"
                    >
                        {/* Animated Background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 p-8 md:p-16 lg:p-24 text-center">
                            <div className="max-w-3xl mx-auto">
                                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-10 shadow-glow">
                                    <MessageCircle className="w-10 h-10 text-white" />
                                </div>

                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-background tracking-tighter leading-tight">
                                    Start Your Fostering Journey in <span className="text-primary">{locationName}</span>
                                </h2>

                                <p className="text-background/60 text-lg md:text-xl mb-12 leading-relaxed">
                                    Join hundreds of families across {locationName} who are already making a difference. Whether you're just starting to explore or ready to apply, we're here to help you find the right path.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/contact" className="w-full sm:w-auto">
                                        <Button
                                            variant="hero"
                                            size="lg"
                                            className="w-full rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                        >
                                            Enquire Today
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/agencies" className="w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full rounded-full border-background/20 text-background hover:bg-background/10"
                                        >
                                            Browse Local Agencies
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">No Obligation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Confidential</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
