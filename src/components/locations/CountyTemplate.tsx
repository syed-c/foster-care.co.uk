"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Phone,
    Star,
    MapPin,
    Users,
    Building2,
    GraduationCap,
    Wallet,
    Clock,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency } from "@/services/dataService";

export interface CountyTemplateProps {
    location: Location;
    childLocations: Location[];
    path: Location[];
    agencies: Agency[];
    stats: {
        childrenInCare: number;
        boroughs: number;
        agenciesCount: number;
    };
    contentSlug?: string;
}

const FOSTERING_SERVICES = [
    { name: "Short-Term Fostering", slug: "short-term", description: "Temporary placements while assessments are made." },
    { name: "Long-Term Fostering", slug: "long-term", description: "Stable homes for children who cannot return to birth families." },
    { name: "Emergency Fostering", slug: "emergency", description: "Same-day placements for children needing immediate care." },
    { name: "Parent and Child Fostering", slug: "parent-child", description: "Supporting young parents and their children together." },
    { name: "Respite Fostering", slug: "respite", description: "Short breaks for families during demanding periods." },
    { name: "Remand / Specialist Fostering", slug: "remand", description: "Specialist care for young people requiring structured support." }
];

export function CountyTemplate({ location, childLocations, agencies, stats, path, contentSlug }: CountyTemplateProps) {
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const regionSlug = location.slug.split('-')[0];
    const regionName = path && path.length > 1 ? path[path.length - 2]?.name : '';

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* 1. HERO SECTION */}
            <section ref={heroRef} className="relative py-16 md:py-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="relative container-main px-4 max-w-4xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
                        <Link href="/locations" className="hover:text-white transition-colors">England</Link>
                        <span>/</span>
                        {regionName && (<><Link href={`/locations/england/${regionSlug}`} className="hover:text-white transition-colors">{regionName}</Link><span>/</span></>)}
                        <span className="text-white font-medium">{locationName}</span>
                    </nav>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                            Fostering Agencies in {locationName}
                        </h1>
                        <p className="text-lg text-stone-300 leading-relaxed mb-8 max-w-2xl">
                            Find Ofsted-regulated fostering agencies in {locationName}. Compare local support, training, and allowances.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1"><Shield className="w-3 h-3 mr-1" />Ofsted-Regulated</Badge>
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1"><MapPin className="w-3 h-3 mr-1" />Local Coverage</Badge>
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1"><Users className="w-3 h-3 mr-1" />24/7 Support</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
                                <Link href="#agencies">Find a Fostering Agency in {locationName}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                            </Button>
                            <Button variant="ghost" className="text-stone-300 hover:text-white hover:bg-white/10 rounded-full px-6" onClick={() => ctaRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                <Phone className="w-4 h-4 mr-2" />Speak to a Local Fostering Expert
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. ABOUT FOSTERING */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container-main px-4 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">About Fostering in {locationName}</h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-base text-stone-600 leading-relaxed mb-4">Fostering provides temporary or permanent homes for children who cannot live with their birth families. In {locationName}, local authorities and independent fostering agencies work together to ensure children receive quality care close to their schools, friends, and communities.</p>
                        <p className="text-base text-stone-600 leading-relaxed mb-4">Across England, there is ongoing demand for foster carers in every county, including {locationName}. Children in care come from diverse backgrounds and have varying needs.</p>
                        <p className="text-base text-stone-600 leading-relaxed mb-6"><strong>Who can foster in {locationName}?</strong> You don't need specific qualifications. What matters most is your ability to provide a safe, stable, and nurturing home. Most agencies welcome applicants who are over 21, have a spare bedroom, and can pass relevant checks.</p>
                    </div>
                </div>
            </section>

            {/* 3. AGENCIES */}
            <section id="agencies" className="py-16 md:py-20 bg-stone-50">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">Fostering Agencies in {locationName}</h2>
                    <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">Verified agencies operating in {locationName}. Sorted by Ofsted rating and reader feedback.</p>
                    {agencies && agencies.length > 0 ? (
                        <div className="space-y-4">{agencies.slice(0, 10).map((agency) => <AgencyCard key={agency.id} agency={agency} />)}</div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                            <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Agencies Found</h3>
                            <p className="text-stone-600 max-w-md mx-auto">We don't have agencies specifically listed for {locationName} yet. Browse agencies in neighbouring areas or contact us for assistance.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. INDEPENDENT vs LOCAL AUTHORITY */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">Independent Agencies vs Local Authority in {locationName}</h2>
                    <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">Understanding your options helps you choose the right fostering path.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50 rounded-2xl border border-stone-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-600" />Independent Fostering Agencies</h3>
                            <div className="space-y-4 text-sm text-stone-600"><p><strong>Support:</strong> Dedicated social worker, 24/7 on-call, smaller caseloads.</p><p><strong>Allowances:</strong> Competitive rates, flexible expenses.</p><p><strong>Training:</strong> Comprehensive initial and ongoing training.</p><p><strong>Best for:</strong> New carers wanting intensive support.</p></div>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-2xl border border-stone-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" />Local Authority Fostering</h3>
                            <div className="space-y-4 text-sm text-stone-600"><p><strong>Support:</strong> Assigned social worker, regular visits.</p><p><strong>Allowances:</strong> Standard national rates.</p><p><strong>Training:</strong> Core programmes, in-house training.</p><p><strong>Best for:</strong> Those prioritising keeping children local.</p></div>
                        </div>
                    </div>
                    <p className="text-stone-600 text-center mt-8 text-sm">Both options provide rewarding fostering experiences. The right choice depends on your circumstances and preferences.</p>
                </div>
            </section>

            {/* 5. FOSTERING SERVICES */}
            <section className="py-16 md:py-20 bg-stone-50">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">Fostering Services in {locationName}</h2>
                    <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">Different types of fostering placements available through agencies.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FOSTERING_SERVICES.map((service) => (
                            <Link key={service.slug} href={`/locations/england/${regionSlug}/${service.slug}`} className="block p-6 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-600">{service.name}</h3>
                                <p className="text-sm text-stone-600">{service.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. WHAT AGENCIES PROVIDE */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">What Fostering Agencies in {locationName} Provide</h2>
                    <p className="text-stone-600 text-center mb-10 max-w-xl mx-auto">All registered fostering agencies offer core support services.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[{ icon: GraduationCap, title: "Training and Development", desc: "Preparation training and ongoing skills development." },
                          { icon: Clock, title: "24/7 Support", desc: "Round-the-clock access to guidance and emergency support." },
                          { icon: Wallet, title: "Financial Allowances", desc: "Weekly maintenance to cover child's living costs." },
                          { icon: Users, title: "Social Worker Support", desc: "Dedicated supervising social worker." },
                          { icon: MessageCircle, title: "Peer Support Networks", desc: "Access to support groups and peer networks." },
                          { icon: MapPin, title: "Local Placement Matching", desc: "Keeping children in their local area." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-stone-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0"><item.icon className="w-6 h-6 text-emerald-600" /></div>
                                <div><h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3><p className="text-sm text-stone-600">{item.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQS */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container-main px-4 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">FAQs – Fostering in {locationName}</h2>
                    <Accordion type="single" collapsible className="bg-white rounded-xl overflow-hidden shadow-sm">
                        {[{ q: `How do I become a foster carers in ${locationName}?`, a: "The process involves an initial conversation, home visit, preparation training, and panel approval. Most agencies offer guidance throughout this 4-6 month process." },
                          { q: `Do fostering agencies in ${locationName} pay allowances?`, a: "Yes. All approved foster carers receive weekly maintenance allowances. Rates vary between agencies and depend on the type of fostering." },
                          { q: `Can I foster if I work full-time in ${locationName}?`, a: "Some arrangements work alongside employment, particularly respite. Most fostering types require daytime availability. Discuss your circumstances with agencies." },
                          { q: `What's the difference between independent and local authority fostering?`, a: "Independent agencies offer specialised support with smaller caseloads. Local authorities focus on keeping children within their local area. Both are Ofsted-regulated." }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-stone-100">
                                <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-stone-600">{faq.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 8. CTA */}
            <section ref={ctaRef} className="py-16 md:py-20 bg-slate-900 text-white">
                <div className="container-main px-4 max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Thinking About Fostering in {locationName}?</h2>
                    <p className="text-stone-300 mb-8 max-w-lg mx-auto">Every child deserves a safe, stable home. We're here to help you find the right path.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8" asChild>
                            <Link href="#agencies">Find a Fostering Agency in {locationName}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-8" asChild>
                            <Link href="/contact">Get Fostering Advice</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function AgencyCard({ agency }: { agency: Agency }) {
    const ofstedRating = agency.ofsted_rating || 'Not rated';
    const ratingColor = ofstedRating === 'Outstanding' ? 'bg-green-100 text-green-800' : ofstedRating === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800';
    return (
        <div className="p-6 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{agency.name}</h3>
                        {agency.agency_type && <Badge variant="outline" className="text-xs">{agency.agency_type}</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 mb-2">
                        {ofstedRating !== 'Not rated' && <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ratingColor}`}><Star className="w-3 h-3 mr-1 fill-current" />Ofsted: {ofstedRating}</span>}
                        {agency.city && <span>{agency.city}</span>}
                    </div>
                    {agency.short_description && <p className="text-sm text-stone-600 line-clamp-2">{agency.short_description}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-full text-sm" asChild><Link href={`/agencies/${agency.slug}`}>View Agency</Link></Button>
                    <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-50 rounded-full text-sm" asChild><Link href={`/agencies/${agency.slug}#contact`}>Contact Agency</Link></Button>
                </div>
            </div>
        </div>
    );
}
