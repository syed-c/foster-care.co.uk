"use strict";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Shield, Users, GraduationCap, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function RegionTemplate({
    location,
    childLocations,
    agencies,
    stats,
    path
}: LocationPageProps) {
    const locationName = location.name;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

            {/* 1. Region-Specific Hero */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/london-hero.png" // Fallback to London/Generic
                        alt={`Supporting foster care in ${locationName}`}
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/90" />
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
                                Regional Hub
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter leading-[1.05] text-white">
                                Foster Care in <span className="text-primary">{locationName}</span>
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-5xl font-black text-primary">{stats.boroughs}</span>
                                    <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Local Planning Areas</span>
                                </div>
                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl md:text-5xl font-black text-primary">{stats.childrenInCare}+</span>
                                    <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Children in Care</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg shadow-lg shadow-primary/20">
                                    Start Your Journey
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg font-bold">
                                    View Local Areas
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Why Foster in Region */}
            <section className="py-24 md:py-32 bg-background-sand">
                <div className="container-main grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter text-slate-950">
                            Diversity & Community in {locationName}
                        </h2>
                        <p className="text-lg text-slate-700/80 leading-relaxed mb-6">
                            {locationName} is one of the most diverse and vibrant regions in the UK. Fostering here means embracing a wealth of cultures, backgrounds, and stories. The need for foster carers who can reflect this diversity and provide culturally sensitive care is paramount.
                        </p>
                        <p className="text-lg text-slate-700/80 leading-relaxed mb-6">
                            We work with local authorities across {stats.boroughs} boroughs to ensure children can stay close to their schools, friends, and birth families whenever possible.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <span className="block text-4xl font-black text-primary mb-2">24/7</span>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Support</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <span className="block text-4xl font-black text-primary mb-2">100%</span>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Local Focus</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Verified Agencies */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container-main">
                    <AgencyListings
                        agencies={agencies}
                        title={`Verified Agencies in ${locationName}`}
                        subtitle={`Top-rated fostering providers serving the ${locationName} region.`}
                        showFeaturedLabel={false}
                        locationName={locationName}
                    />
                </div>
            </section>

            {/* 4. Support Systems */}
            {/* 4. Support Systems */}
            <section className="py-24 bg-slate-950 text-white">
                <div className="container-main text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-white">Regional Support Network</h2>
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
                            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <item.icon className="w-10 h-10 text-primary mb-6" />
                                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                                <p className="text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Can I Foster (Regional) */}
            <section className="py-24 bg-background-sand">
                <div className="container-main max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-8 text-slate-950">Eligibility in {locationName}</h2>
                    <p className="text-lg text-slate-600 mb-12">
                        While national criteria apply, {locationName} especially welcomes carers who can offer homes to sibling groups and teenagers. Housing costs in the region are considered in our allowance structures.
                    </p>
                    <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 text-left">
                        <h3 className="font-bold text-xl mb-4">Regional Myth-Busting</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-slate-700">You DO NOT need to be a homeowner to foster in {locationName}. Renting is perfectly fine.</span>
                            </li>
                            <li className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-slate-700">You can work full-time, as long as you can be available for the child's needs.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 6. Borough Directory - DARK MODE */}
            {childLocations.length > 0 && (
                <section className="py-24 bg-slate-950 text-white">
                    <div className="container-main">
                        <h2 className="text-3xl md:text-4xl font-black mb-12 text-white text-center">Find Your Local Area</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {childLocations.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/locations/${path.map(p => p.slug).join('/')}/${child.slug}`}
                                    className="block p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                                >
                                    <span className="font-bold text-white group-hover:text-primary transition-colors text-lg">{child.name}</span>
                                    <span className="block text-xs uppercase tracking-widest text-white/50 mt-2">View Profile</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. CTA Footer */}
            <section className="py-12 bg-white text-center">
                <div className="container-main">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">Ready to take the next step?</p>
                    <Button size="lg" className="rounded-full bg-primary text-white font-black h-16 px-10 text-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                        Enquire for {locationName}
                    </Button>
                </div>
            </section>
        </div>
    );
}
