"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Shield, Activity, Users, GraduationCap, Home, CheckCircle, Info, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { cn } from "@/lib/utils";
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
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/london-hero.png"
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-slate-900/40" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                <MapPin className="w-3.5 h-3.5 mr-2 inline" />
                                Regional Fostering Hub
                            </Badge>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.95] text-white">
                                Foster Care in <span className="text-primary italic">{locationName}</span>
                            </h1>

                            {/* Regional Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-14 max-w-3xl mx-auto">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="text-3xl md:text-5xl font-black text-primary mb-1">{stats.childrenInCare.toLocaleString()}+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Children in Care</div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.boroughs || childLocations.length}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Counties & Areas</div>
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
                                    View Local Areas
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why [Region] is Unique - Cultural/Local Authority Perspective */}
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
                                Regional Identity
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter text-slate-950 leading-[1.1]">
                                Why {locationName} is Unique for <span className="text-primary italic">Foster Care</span>
                            </h2>
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                <p>
                                    {locationName} represents a unique tapestry of communities, from urban centers to historical towns. Fostering in this region means navigating a diverse landscape where culture, tradition, and modern living intersect. The need for foster carers who understand the local context—whether it's the specific challenges of city life or the stability of community roots—is more critical than ever.
                                </p>
                                <p>
                                    The regional authorities in {locationName} work closely with independent agencies to ensure that children remain within their cultural and social spheres, minimizing the trauma of displacement.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-8">
                                <div className="flex flex-col gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                        <Landmark className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-black text-slate-950 text-lg">Local Authority Collab</h3>
                                    <p className="text-slate-500 text-sm font-medium">Strong partnerships between agencies and councils.</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-black text-slate-950 text-lg">Diverse Placement</h3>
                                    <p className="text-slate-500 text-sm font-medium">Matching children with families who share their background.</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                                <img
                                    src="/images/locations/generic-hero.png"
                                    alt={`Fostering in ${locationName}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary rounded-[3rem] -z-0 rotate-12 flex items-center justify-center p-8 text-white">
                                <div className="text-center">
                                    <div className="text-4xl font-black mb-1">High</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-white/80">Regional Demand</div>
                                </div>
                            </div>
                        </div>
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
            <section className="py-24 md:py-32 bg-slate-950 text-white rounded-[4rem] mx-4 my-8">
                <div className="container-main text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-8">
                        Regional Support Network
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-16 text-white tracking-tighter">Support Built Around You</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
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
                                title: "24/7 Presence",
                                desc: "Social workers based locally who know the region and its specific needs."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                                    <item.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-white">{item.title}</h3>
                                <p className="text-white/60 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. County Directory */}
            {childLocations.length > 0 && (
                <section className="py-24 md:py-32 bg-white">
                    <div className="container-main">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-950 tracking-tighter">Explore Local Areas in {locationName}</h2>
                            <p className="text-xl text-slate-600 font-medium">Find specific fostering information for your local county or borough.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {childLocations.map((child, i) => (
                                <motion.div
                                    key={child.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={`/locations/${(path || []).map(p => p.slug).join('/') || location.slug}/${child.slug}`}
                                        className="group block relative overflow-hidden rounded-[3rem] aspect-[4/3] bg-slate-100 border border-slate-200/50 hover:border-primary/50 transition-colors"
                                    >
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10" />
                                        <img
                                            src="/images/locations/generic-hero.png"
                                            alt={`Foster care in ${child.name}`}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        <div className="absolute bottom-10 left-10 right-10 z-20">
                                            <div className="text-[10px] uppercase tracking-widest text-primary font-black mb-2 flex items-center gap-2">
                                                <div className="w-6 h-0.5 bg-primary" />
                                                Local Community
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors">{child.name}</h3>
                                            <span className="text-white/80 font-bold flex items-center gap-2 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Explore <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. Shared CTA Section */}
            <CTASection locationName={locationName} theme="light" className="bg-background-sand" />
        </div>
    );
}
