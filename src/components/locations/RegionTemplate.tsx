"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Shield, Activity, Users, GraduationCap, Home, CheckCircle, Info, Landmark, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
import { AgencyListings } from "@/components/location/AgencyListings";
import { ProcessSection } from "./shared/ProcessSection";
import { CTASection } from "./shared/CTASection";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { InteractiveCard } from "./shared/InteractiveCard";
import { SectionIntro } from "./shared/SectionIntro";
import { SwipeableCards } from "./shared/SwipeableCards";
import { CarouselSection } from "./shared/CarouselSection";

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
    path
}: LocationPageProps) {
    const locationName = location.name;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">

            {/* 1. Region-Specific Hero */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-48 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/london-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-slate-900/40" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <ScrollReveal effect="slideUp">
                            <div className="text-center">
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                    <MapPin className="w-3.5 h-3.5 mr-2 inline" />
                                    Regional Fostering Hub
                                </Badge>

                                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-12 tracking-tighter leading-[0.9] text-white">
                                    Foster Care in <span className="text-primary italic">{locationName}</span>
                                </h1>
                            </div>
                        </ScrollReveal>

                        {/* Regional Stats Grid */}
                        <ScrollReveal effect="slideUp" delay={0.2}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto">
                                <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md text-center" hoverLift={true}>
                                    <div className="text-4xl md:text-6xl font-black text-primary mb-2 italic">{stats.childrenInCare.toLocaleString()}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Children in Care</div>
                                </InteractiveCard>
                                <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md text-center" hoverLift={true}>
                                    <div className="text-4xl md:text-6xl font-black text-white mb-2 italic">{stats.boroughs || childLocations.length}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Local Areas</div>
                                </InteractiveCard>
                                <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md text-center col-span-2 md:col-span-1" hoverLift={true}>
                                    <div className="text-4xl md:text-6xl font-black text-white mb-2 italic">{stats.agenciesCount}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Verified Agencies</div>
                                </InteractiveCard>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal effect="slideUp" delay={0.4}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-18 px-12 text-xl shadow-2xl shadow-primary/30">
                                    Start Your Journey
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-18 px-12 text-xl font-black">
                                    View Local Areas
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 2. Why [Region] is Unique */}
            <section className="py-24 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <ScrollReveal effect="slideLeft">
                            <SectionIntro
                                eyebrow="Regional Identity"
                                heading={<>Why {locationName} is Unique for <br /><span className="text-primary italic">Foster Care</span></>}
                            />
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                <p>
                                    {locationName} represents a unique tapestry of communities, from urban centers to historical towns. Fostering in this region means navigating a diverse landscape where culture, tradition, and modern living intersect.
                                </p>
                                <p>
                                    The regional authorities in {locationName} work closely with independent agencies to ensure that children remain within their cultural and social spheres, minimizing the trauma of displacement.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8">
                                <InteractiveCard className="p-6 bg-white border-slate-100" hoverLift={false}>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Landmark className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-black text-slate-950 text-lg mb-1">Regional Collab</h3>
                                    <p className="text-slate-500 text-sm font-medium">Strong partnerships across the region.</p>
                                </InteractiveCard>
                                <InteractiveCard className="p-6 bg-white border-slate-100" hoverLift={false}>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-black text-slate-950 text-lg mb-1">Cultural Ties</h3>
                                    <p className="text-slate-500 text-sm font-medium">Matching children with their heritage.</p>
                                </InteractiveCard>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal effect="slideRight" className="relative group">
                            <div className="aspect-[4/3] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group-hover:-rotate-1 transition-transform duration-500">
                                <img
                                    src="/images/locations/generic-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary rounded-[3rem] -z-0 rotate-12 flex items-center justify-center p-8 text-white shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                                <div className="text-center">
                                    <div className="text-4xl font-black mb-1">High</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-white/80">Regional Demand</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 3. Verified Agencies */}
            <section className="py-24 md:py-32 bg-white border-y border-slate-100">
                <div className="container-main">
                    <AgencyListings
                        agencies={agencies}
                        title={`Verified Agencies in ${locationName}`}
                        subtitle={`Top-rated fostering providers serving the ${locationName} region with 24/7 support.`}
                        showFeaturedLabel={false}
                        locationName={locationName}
                    />
                </div>
            </section>

            {/* 4. Shared Process Section */}
            <ProcessSection locationName={locationName} className="bg-white" />

            {/* 5. Support Systems */}
            <section className="py-24 md:py-32 bg-slate-950 text-white rounded-[4rem] mx-4 my-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                <div className="container-main px-4 text-center max-w-6xl mx-auto relative z-10">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Regional Support Network"
                            heading="Support Built Around You"
                            center={true}
                            inverted={true}
                        />
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
                        {[
                            {
                                icon: Users,
                                title: "Localized Matching",
                                desc: "We prioritize ensuring children remain within their familiar communities in the region."
                            },
                            {
                                icon: GraduationCap,
                                title: "Training Hubs",
                                desc: `Specialist training centers located throughout ${locationName} for easy access.`
                            },
                            {
                                icon: Home,
                                title: "Regional Presence",
                                desc: "Social workers based locally who know the region and its specific requirements."
                            }
                        ].map((item, i) => (
                            <ScrollReveal effect="slideUp" delay={i * 0.15} key={i}>
                                <InteractiveCard className="p-10 bg-white/5 border-white/10 group hover:border-primary/50" hoverLift={true}>
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-white/60 leading-relaxed font-medium">{item.desc}</p>
                                </InteractiveCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. County Directory */}
            {childLocations.length > 0 && (
                <section className="py-24 md:py-32 bg-white scroll-mt-20">
                    <div className="container-main px-4">
                        <ScrollReveal effect="slideUp">
                            <SectionIntro
                                heading={<>Explore Local Areas in <span className="text-primary italic">{locationName}</span></>}
                                subheading={`Find specific fostering information for your local county or borough in the ${locationName} region.`}
                                center={true}
                            />
                        </ScrollReveal>

                        <ScrollReveal effect="none" staggerChildren staggerDelay={0.05}>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {childLocations.map((child) => (
                                    <ScrollRevealItem key={child.id}>
                                        <Link
                                            href={`/locations/${(path || []).map(p => p.slug).join('/') || location.slug}/${child.slug}`}
                                            className="group block relative overflow-hidden rounded-[3rem] aspect-[4/3] bg-slate-100 border border-slate-200/50 shadow-sm"
                                        >
                                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10" />
                                            <img
                                                src="/images/locations/generic-hero.png"
                                                alt={`Foster care in ${child.name}`}
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
                                                    Local Community
                                                </div>
                                                <h3 className="text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors leading-tight">{child.name}</h3>
                                                <span className="text-white/80 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                    Explore Area <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    </ScrollRevealItem>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* 7. Shared CTA Section */}
            <CTASection locationName={locationName} theme="light" className="bg-background-sand" />
        </div>
    );
}
