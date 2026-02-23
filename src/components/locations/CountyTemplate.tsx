"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency } from "@/services/dataService";
import { useLocationContent } from "@/hooks/useLocationContent";

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

interface HeroData {
    heading: string;
    subheading: string;
    trust_badges?: string[];
    cta_primary: { text: string; url: string };
    cta_secondary: { text: string; url: string };
}

interface AboutData {
    heading: string;
    paragraphs: string[];
}

interface AgencyTypesData {
    heading: string;
    intro: string;
    independent: {
        title: string;
        description: string;
        benefits?: string[];
    };
    local_authority: {
        title: string;
        description: string;
        benefits?: string[];
    };
    outro?: string;
}

interface FosteringService {
    name: string;
    description: string;
    slug: string;
}

interface FosteringServicesData {
    heading: string;
    intro: string;
    services: FosteringService[];
}

interface WhatAgenciesProvideCategory {
    name: string;
    description: string;
}

interface WhatAgenciesProvideData {
    heading: string;
    intro: string;
    categories: WhatAgenciesProvideCategory[];
}

interface FAQQuestion {
    question: string;
    answer: string;
}

interface FAQData {
    heading: string;
    questions: FAQQuestion[];
}

interface CTData {
    heading: string;
    paragraph: string;
    button_text: string;
}

interface CountyContentData {
    hero?: HeroData;
    about?: AboutData;
    agency_types?: AgencyTypesData;
    fostering_services?: FosteringServicesData;
    what_agencies_provide?: WhatAgenciesProvideData;
    faq?: FAQData;
    cta?: CTData;
}

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const UNDRAW_ILLUSTRATIONS = {
    hero: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80",
    about: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
    agenciesEmpty: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80",
    independent: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    localAuthority: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80",
    faq: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
    cta: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    shortTerm: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80",
    longTerm: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    emergency: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400&q=80",
    respite: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&q=80",
    therapeutic: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    parentChild: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80",
    training: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80",
    support: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&q=80",
    financial: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&q=80",
    socialWorker: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
    peerSupport: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80",
    localPlacement: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&q=80",
};

export function CountyTemplate({ location, childLocations, agencies, stats, path, contentSlug }: CountyTemplateProps) {
    const { data: locationContent, isLoading } = useLocationContent(contentSlug || location.slug);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const regionSlug = location.slug.split('-')[0];
    const regionName = path && path.length > 1 ? path[path.length - 2]?.name : '';
    const countrySlug = path && path.length > 0 ? path[0]?.slug : 'england';

    const c: CountyContentData = locationContent?.content || {};

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1117' }}>
                <main className="flex-1 pt-20">
                    <section className="relative py-20 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '60px', paddingBottom: '60px' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <div className="h-6 w-64 mb-6 bg-white/10 rounded animate-pulse" style={{ width: '200px' }}></div>
                            <div className="h-12 w-[500px] mb-4 bg-white/10 rounded animate-pulse" style={{ width: '400px' }}></div>
                            <div className="h-6 w-full max-w-2xl bg-white/10 rounded animate-pulse" style={{ maxWidth: '480px' }}></div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* SECTION 1: HERO - DARK */}
            {c.hero && (
                <section ref={heroRef} className="relative overflow-hidden" style={{ backgroundColor: '#0f1117', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <div className="grid md:grid-cols-[55%,45%] gap-12 items-center">
                            {/* Left column - Text */}
                            <FadeInSection>
                                <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6b7280', fontSize: '13px' }}>
                                    <Link href="/locations" className="hover:text-white transition-colors">England</Link>
                                    <span style={{ color: '#374151' }}>&rsaquo;</span>
                                    {regionName && (
                                        <>
                                            <Link href={`/locations/${countrySlug}/${regionSlug}`} className="hover:text-white transition-colors">{regionName}</Link>
                                            <span style={{ color: '#374151' }}>&rsaquo;</span>
                                        </>
                                    )}
                                    <span style={{ color: '#9ca3af' }}>{locationName}</span>
                                </nav>

                                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.15, maxWidth: '520px' }}>
                                    {c.hero.heading}
                                </h1>

                                <p className="text-lg" style={{ color: '#9ca3af', maxWidth: '480px', marginTop: '16px', fontSize: '18px', lineHeight: 1.75 }}>
                                    {c.hero.subheading}
                                </p>

                                {c.hero.trust_badges && c.hero.trust_badges.length > 0 && (
                                    <div className="flex flex-wrap gap-2" style={{ marginTop: '24px' }}>
                                        {c.hero.trust_badges.map((badge, i) => (
                                            <span key={i} className="inline-flex" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '6px 14px', color: '#d1d5db', fontSize: '13px' }}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-4" style={{ marginTop: '32px' }}>
                                    {c.hero.cta_primary && (
                                        <Button asChild style={{ backgroundColor: '#22c55e', color: '#fff', fontWeight: 600, borderRadius: '8px', padding: '14px 28px' }} className="hover:bg-green-600 transition-colors duration-200">
                                            <Link href={c.hero.cta_primary.url}>{c.hero.cta_primary.text}</Link>
                                        </Button>
                                    )}
                                    {c.hero.cta_secondary && (
                                        <Button asChild style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', padding: '14px 28px' }} className="hover:border-green-500 hover:text-green-500 transition-colors duration-200">
                                            <Link href={c.hero.cta_secondary.url}>{c.hero.cta_secondary.text}</Link>
                                        </Button>
                                    )}
                                </div>
                            </FadeInSection>

                            {/* Right column - Illustration */}
                            <div className="hidden md:block relative" style={{ maxWidth: '480px', marginLeft: 'auto' }}>
                                <FadeInSection>
                                    <div className="relative" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <Image 
                                            src={UNDRAW_ILLUSTRATIONS.hero} 
                                            alt="Foster family welcoming a child"
                                            width={480}
                                            height={400}
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                            priority
                                        />
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 2: ABOUT - LIGHT */}
            {c.about && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <div className="grid md:grid-cols-[60%,40%] gap-12 items-center">
                            {/* Left column - Text */}
                            <FadeInSection>
                                <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    About Fostering in {locationName}
                                </span>
                                <h2 className="text-3xl font-bold" style={{ color: '#111827', fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>
                                    {c.about.heading}
                                </h2>
                                <div className="space-y-4">
                                    {c.about.paragraphs.map((paragraph, i) => (
                                        <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </FadeInSection>

                            {/* Right column - Photography */}
                            <FadeInSection>
                                <div className="relative">
                                    <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '80px', height: '80px', backgroundColor: '#22c55e', borderRadius: '4px', zIndex: 0 }}></div>
                                    <div className="relative" style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5' }}>
                                        <Image 
                                            src={UNDRAW_ILLUSTRATIONS.about} 
                                            alt="Foster family at home"
                                            width={400}
                                            height={500}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </FadeInSection>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 3: AGENCIES - LIGHT GREY */}
            <section id="agencies" className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '60px', paddingBottom: '60px' }}>
                <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                    <FadeInSection>
                        <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827', fontSize: '30px', fontWeight: 700 }}>
                            Fostering Agencies in {locationName}
                        </h2>
                        <p className="text-center mb-12 mx-auto" style={{ color: '#6b7280', maxWidth: '500px' }}>
                            Verified agencies operating in {locationName}. Sorted by Ofsted rating and carer feedback.
                        </p>
                    </FadeInSection>

                    {agencies && agencies.length > 0 ? (
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                            {agencies.slice(0, 9).map((agency) => (
                                <AgencyCard key={agency.id} agency={agency} />
                            ))}
                        </div>
                    ) : (
                        <FadeInSection>
                            <div className="text-center py-16" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                                <div className="relative w-48 h-48 mx-auto mb-6" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <Image 
                                        src={UNDRAW_ILLUSTRATIONS.agenciesEmpty} 
                                        alt="No agencies found"
                                        width={192}
                                        height={192}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                    />
                                </div>
                                <p className="mb-6 mx-auto" style={{ color: '#6b7280', maxWidth: '400px' }}>
                                    No agencies specifically listed for {locationName} yet. Browse agencies in neighbouring areas or contact us for assistance.
                                </p>
                                <Button asChild style={{ backgroundColor: '#0f1117', color: '#fff', borderRadius: '8px', padding: '12px 24px' }}>
                                    <Link href="/agencies">Browse All Agencies</Link>
                                </Button>
                            </div>
                        </FadeInSection>
                    )}

                    {agencies && agencies.length > 9 && (
                        <div className="text-center mt-10">
                            <Button asChild style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#374151', borderRadius: '8px', padding: '12px 24px' }} className="hover:bg-gray-50 transition-colors">
                                <Link href={`/agencies?location=${location.slug}`}>Load More Agencies</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 4: AGENCY TYPES - DARK */}
            {c.agency_types && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#ffffff', fontSize: '30px', fontWeight: 700 }}>
                                {c.agency_types.heading}
                            </h2>
                            <p className="text-center mx-auto mb-12" style={{ color: '#9ca3af', maxWidth: '560px', marginBottom: '48px' }}>
                                {c.agency_types.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Independent Card */}
                            <FadeInSection>
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '3px solid #22c55e', borderRadius: '12px' }}>
                                    <div className="relative h-20 mb-6" style={{ width: '80px' }}>
                                        <Image 
                                            src={UNDRAW_ILLUSTRATIONS.independent} 
                                            alt="Independent fostering"
                                            width={80}
                                            height={80}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', filter: 'hue-rotate(80deg) saturate(0.6)' }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#ffffff', fontWeight: 600 }}>
                                        {c.agency_types.independent.title}
                                    </h3>
                                    <p className="mb-6" style={{ color: '#d1d5db' }}>
                                        {c.agency_types.independent.description}
                                    </p>
                                    {c.agency_types.independent.benefits && c.agency_types.independent.benefits.length > 0 && (
                                        <div className="space-y-0">
                                            {c.agency_types.independent.benefits.map((benefit, i) => (
                                                <div key={i} className="py-3" style={{ borderBottom: i < c.agency_types.independent.benefits.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                                                    <span className="inline-block w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#22c55e' }}></span>
                                                    <span style={{ color: '#d1d5db', fontSize: '15px' }}>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FadeInSection>

                            {/* Local Authority Card */}
                            <FadeInSection>
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '3px solid #6b7280', borderRadius: '12px' }}>
                                    <div className="relative h-20 mb-6" style={{ width: '80px' }}>
                                        <Image 
                                            src={UNDRAW_ILLUSTRATIONS.localAuthority} 
                                            alt="Local authority fostering"
                                            width={80}
                                            height={80}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', filter: 'grayscale(50%)' }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#ffffff', fontWeight: 600 }}>
                                        {c.agency_types.local_authority.title}
                                    </h3>
                                    <p className="mb-6" style={{ color: '#d1d5db' }}>
                                        {c.agency_types.local_authority.description}
                                    </p>
                                    {c.agency_types.local_authority.benefits && c.agency_types.local_authority.benefits.length > 0 && (
                                        <div className="space-y-0">
                                            {c.agency_types.local_authority.benefits.map((benefit, i) => (
                                                <div key={i} className="py-3" style={{ borderBottom: i < c.agency_types.local_authority.benefits.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                                                    <span className="inline-block w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6b7280' }}></span>
                                                    <span style={{ color: '#d1d5db', fontSize: '15px' }}>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FadeInSection>
                        </div>

                        {c.agency_types.outro && (
                            <FadeInSection>
                                <p className="text-center mx-auto mt-12" style={{ color: '#9ca3af', maxWidth: '600px', marginTop: '40px' }}>
                                    {c.agency_types.outro}
                                </p>
                            </FadeInSection>
                        )}
                    </div>
                </section>
            )}

            {/* SECTION 5: FOSTERING SERVICES - LIGHT */}
            {c.fostering_services && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827', fontSize: '30px', fontWeight: 700 }}>
                                {c.fostering_services.heading}
                            </h2>
                            <p className="text-center mx-auto mb-12" style={{ color: '#6b7280', maxWidth: '540px', marginBottom: '48px' }}>
                                {c.fostering_services.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                            {c.fostering_services.services.map((service, i) => {
                                const serviceImages = [UNDRAW_ILLUSTRATIONS.shortTerm, UNDRAW_ILLUSTRATIONS.longTerm, UNDRAW_ILLUSTRATIONS.emergency, UNDRAW_ILLUSTRATIONS.respite, UNDRAW_ILLUSTRATIONS.therapeutic, UNDRAW_ILLUSTRATIONS.parentChild];
                                const serviceImage = serviceImages[i % serviceImages.length];
                                
                                return (
                                    <FadeInSection key={i}>
                                        <Link 
                                            href={`/locations/${countrySlug}/${regionSlug}/${location.slug}/${service.slug}`}
                                            className="block p-7 rounded-xl h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        >
                                            <div className="relative h-20 mb-4" style={{ width: '80px' }}>
                                                <Image 
                                                    src={serviceImage} 
                                                    alt={service.name}
                                                    width={80}
                                                    height={80}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', filter: 'hue-rotate(80deg) saturate(0.6)' }}
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827', fontWeight: 600 }}>{service.name}</h3>
                                            <p className="mb-4" style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>{service.description}</p>
                                            <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 600 }}>Learn more about {service.name} &rarr;</span>
                                        </Link>
                                    </FadeInSection>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 6: WHAT AGENCIES PROVIDE - LIGHT GREY */}
            {c.what_agencies_provide && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#111827', fontSize: '30px', fontWeight: 700 }}>
                                {c.what_agencies_provide.heading}
                            </h2>
                            <p className="text-center mx-auto mb-12" style={{ color: '#6b7280', maxWidth: '540px', marginBottom: '48px' }}>
                                {c.what_agencies_provide.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                            {c.what_agencies_provide.categories.map((category, i) => {
                                const categoryImages = [UNDRAW_ILLUSTRATIONS.training, UNDRAW_ILLUSTRATIONS.support, UNDRAW_ILLUSTRATIONS.financial, UNDRAW_ILLUSTRATIONS.socialWorker, UNDRAW_ILLUSTRATIONS.peerSupport, UNDRAW_ILLUSTRATIONS.localPlacement];
                                const categoryImage = categoryImages[i % categoryImages.length];
                                
                                return (
                                    <FadeInSection key={i}>
                                        <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                            <div className="relative h-10 mb-4" style={{ width: '40px' }}>
                                                <Image 
                                                    src={categoryImage} 
                                                    alt={category.name}
                                                    width={40}
                                                    height={40}
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', filter: 'hue-rotate(80deg) saturate(0.6)' }}
                                                />
                                            </div>
                                            <h3 className="font-semibold mb-2" style={{ color: '#111827', fontWeight: 600, fontSize: '16px' }}>{category.name}</h3>
                                            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>{category.description}</p>
                                        </div>
                                    </FadeInSection>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 7: FAQ - DARK */}
            {c.faq && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <div className="grid md:grid-cols-[50%,50%] gap-12">
                            {/* Left column */}
                            <FadeInSection>
                                <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                    FAQs
                                </span>
                                <h2 className="text-3xl font-bold mb-4" style={{ color: '#ffffff', fontSize: '30px', fontWeight: 700 }}>
                                    {c.faq.heading}
                                </h2>
                                <p className="mb-6" style={{ color: '#9ca3af' }}>
                                    Everything you need to know about fostering in {locationName}.
                                </p>
                                <div className="relative hidden md:block" style={{ maxWidth: '300px' }}>
                                    <Image 
                                        src={UNDRAW_ILLUSTRATIONS.faq} 
                                        alt="FAQ"
                                        width={300}
                                        height={200}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '12px', filter: 'hue-rotate(80deg) saturate(0.6)', opacity: 0.8 }}
                                    />
                                </div>
                            </FadeInSection>

                            {/* Right column - Accordion */}
                            <FadeInSection>
                                <Accordion type="single" collapsible className="rounded-xl overflow-hidden">
                                    {c.faq.questions.map((faq, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                            <AccordionTrigger className="px-0 py-5 hover:no-underline" style={{ color: '#f3f4f6', fontWeight: 600, fontSize: '16px', justifyContent: 'space-between' }}>
                                                <span className="flex-1 text-left">{faq.question}</span>
                                                <span className="ml-4 text-green-500 font-light text-xl" style={{ color: '#22c55e', fontWeight: 300, fontSize: '20px' }}>&times;</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-5 pt-0" style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.75 }}>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </FadeInSection>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 8: CTA - BRAND GREEN */}
            {c.cta && (
                <section ref={ctaRef} className="py-14 md:py-24 text-center relative overflow-hidden" style={{ backgroundColor: '#22c55e', paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 hidden md:block">
                        <Image 
                            src={UNDRAW_ILLUSTRATIONS.cta} 
                            alt=""
                            width={256}
                            height={256}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0) invert(1)' }}
                        />
                    </div>
                    <div className="mx-auto px-4 relative z-10" style={{ maxWidth: '640px' }}>
                        <FadeInSection>
                            <h2 className="text-3xl font-bold mb-4" style={{ color: '#ffffff', fontSize: '32px', fontWeight: 700 }}>
                                {c.cta.heading}
                            </h2>
                            <p className="mb-8 mx-auto" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px' }}>
                                {c.cta.paragraph}
                            </p>
                            <Button asChild style={{ backgroundColor: '#ffffff', color: '#15803d', fontWeight: 700, borderRadius: '8px', padding: '16px 36px', fontSize: '16px' }} className="hover:bg-green-50 hover:scale-[1.02] transition-all duration-150">
                                <Link href="/become-a-foster">{c.cta.button_text}</Link>
                            </Button>
                        </FadeInSection>
                    </div>
                </section>
            )}
        </div>
    );
}

function AgencyCard({ agency }: { agency: Agency }) {
    const ofstedRating = agency.ofsted_rating || 'Not rated';
    const ratingStyles = ofstedRating === 'Outstanding' 
        ? { bg: '#dcfce7', color: '#15803d' }
        : ofstedRating === 'Good'
        ? { bg: '#dbeafe', color: '#1d4ed8' }
        : { bg: '#fef9c3', color: '#854d0e' };

    return (
        <div className="p-6 rounded-xl transition-shadow hover:shadow-md" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {agency.logo_url && (
                <div className="h-12 mb-4 flex items-center">
                    <Image 
                        src={agency.logo_url} 
                        alt={agency.name}
                        width={120}
                        height={48}
                        style={{ height: '48px', width: 'auto', maxWidth: '120px', objectFit: 'contain' }}
                    />
                </div>
            )}
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827', fontWeight: 600, fontSize: '18px' }}>
                {agency.name}
            </h3>
            {ofstedRating !== 'Not rated' && (
                <span className="inline-block mb-3" style={{ backgroundColor: ratingStyles.bg, color: ratingStyles.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>
                    {ofstedRating}
                </span>
            )}
            {agency.short_description && (
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6b7280', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {agency.short_description}
                </p>
            )}
            {agency.acceptance_types && agency.acceptance_types.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {agency.acceptance_types.slice(0, 3).map((type, i) => (
                        <span key={i} className="inline-block text-xs px-2 py-1" style={{ backgroundColor: '#f3f4f6', borderRadius: '4px', color: '#6b7280', fontSize: '12px' }}>
                            {type}
                        </span>
                    ))}
                    {agency.acceptance_types.length > 3 && (
                        <span className="inline-block text-xs px-2 py-1" style={{ color: '#6b7280', fontSize: '12px' }}>
                            +{agency.acceptance_types.length - 3} more
                        </span>
                    )}
                </div>
            )}
            <Link 
                href={`/agencies/${agency.slug}`} 
                className="block mt-4 pt-4 border-t"
                style={{ borderTop: '1px solid #f3f4f6', color: '#22c55e', fontWeight: 600, fontSize: '14px' }}
            >
                View Agency &rarr;
            </Link>
        </div>
    );
}
