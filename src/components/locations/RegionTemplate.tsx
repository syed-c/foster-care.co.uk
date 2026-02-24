"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
    HelpCircle,
    BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency } from "@/services/dataService";
import { useLocationContent } from "@/hooks/useLocationContent";

export interface LocationPageProps {
    location: Location;
    childLocations?: Location[];
    path?: Location[];
    agencies?: Agency[];
    stats?: {
        childrenInCare: number;
        boroughs: number;
        agenciesCount: number;
    };
    contentSlug?: string;
    initialContent?: any;
}

const FOSTERING_SERVICES = [
    { name: "Short-Term Fostering", slug: "short-term", description: "Temporary placements while assessments are made." },
    { name: "Long-Term Fostering", slug: "long-term", description: "Stable homes for children who cannot return to birth families." },
    { name: "Emergency Fostering", slug: "emergency", description: "Same-day placements for children needing immediate care." },
    { name: "Parent and Child Fostering", slug: "parent-child", description: "Supporting young parents and their children together." },
    { name: "Respite Fostering", slug: "respite", description: "Short breaks for families during demanding periods." },
    { name: "Remand / Specialist Fostering", slug: "remand", description: "Specialist care for young people requiring structured support." }
];

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function RegionTemplate({ location, childLocations, agencies, stats, path, contentSlug, initialContent }: LocationPageProps) {
    const { data: locationContent, isLoading } = useLocationContent(contentSlug || location.slug);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const countrySlug = path && path.length > 0 ? path[0]?.slug : 'england';

    const content = initialContent || locationContent?.content;

    // Show loading only if still loading AND no content available (neither from SSR nor client)
    if (isLoading && !content) {
        return (
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1117' }}>
                <main className="flex-1 pt-20">
                    <section className="relative py-20 md:py-28" style={{ backgroundColor: '#0f1117' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <div className="h-6 w-64 mb-6 bg-white/10 rounded animate-pulse" style={{ width: '160px' }}></div>
                            <div className="h-16 w-[500px] mb-4 bg-white/10 rounded animate-pulse" style={{ width: '400px' }}></div>
                            <div className="h-6 w-full max-w-2xl bg-white/10 rounded animate-pulse" style={{ maxWidth: '560px' }}></div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* 1. HERO SECTION */}
            {content?.hero && (
                <section ref={heroRef} className="relative py-14 md:py-24 overflow-hidden" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="hero">
                    <div className="relative mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6b7280', fontSize: '13px' }}>
                                <Link href="/locations" className="hover:text-white transition-colors">England</Link>
                                <span style={{ color: '#374151' }}>&rsaquo;</span>
                                <span style={{ color: '#9ca3af' }}>{locationName}</span>
                            </nav>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2 }}>
                                {content.hero.heading}
                            </h1>
                            <p className="text-lg mb-8" style={{ color: '#9ca3af', maxWidth: '560px', fontSize: '18px', lineHeight: 1.75 }}>
                                {content.hero.subheading}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                {(content.hero.trust_badges || []).map((badge: string, i: number) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {content.hero.cta_primary && (
                                    <Button size="lg" style={{ backgroundColor: '#22c55e', color: 'white', borderRadius: '8px', padding: '14px 28px', fontWeight: 600 }} className="hover:translate-y-[-2px] transition-transform duration-200" asChild>
                                        <Link href="#agencies">{content.hero.cta_primary}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                                    </Button>
                                )}
                                {content.hero.cta_secondary && (
                                    <Button variant="ghost" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', padding: '14px 28px' }} className="hover:translate-y-[-2px] transition-transform duration-200" onClick={() => ctaRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                        <Phone className="w-4 h-4 mr-2" />{content.hero.cta_secondary}
                                    </Button>
                                )}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 2. ABOUT SECTION */}
            {content?.about && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="about">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#111827', fontWeight: 700 }}>
                                {content.about.heading}
                            </h2>
                            <div className="space-y-4">
                                {content.about.paragraphs.map((paragraph: string, i: number) => (
                                    <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}>{paragraph}</p>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 3. AGENCIES SECTION - Dynamic from DB */}
            <section id="agencies" className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }}>
                <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                    <FadeInSection>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>
                            Fostering Agencies in {locationName}
                        </h2>
                        <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                            Verified agencies operating in {locationName}. Sorted by Ofsted rating and reader feedback.
                        </p>
                    </FadeInSection>

                    {agencies && agencies.length > 0 ? (
                        <div className="space-y-4">
                            {agencies.slice(0, 10).map((agency) => <AgencyCard key={agency.id} agency={agency} />)}
                        </div>
                    ) : (
                        <FadeInSection>
                            <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                <Building2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>No Agencies Found</h3>
                                <p className="max-w-md mx-auto" style={{ color: '#6b7280' }}>We don't have agencies specifically listed for {locationName} yet.</p>
                            </div>
                        </FadeInSection>
                    )}
                </div>
            </section>

            {/* 4. AGENCY TYPES SECTION */}
            {content?.agency_types && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="agency-types">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#ffffff', fontWeight: 700 }}>
                                {content.agency_types.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>
                                {content.agency_types.intro}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#22c55e' }}>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                        <Building2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                                        {content.agency_types.independent.title}
                                    </h3>
                                    <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                        <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> {content.agency_types.independent.description}</p>
                                        {content.agency_types.independent.benefits?.map((benefit: string, i: number) => (
                                            <p key={i}><span style={{ color: '#22c55e', marginRight: '8px' }}>-</span>{benefit}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#6b7280' }}>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                        <Shield className="w-5 h-5" style={{ color: '#6b7280' }} />
                                        {content.agency_types.local_authority.title}
                                    </h3>
                                    <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                        <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> {content.agency_types.local_authority.description}</p>
                                        {content.agency_types.local_authority.benefits?.map((benefit: string, i: number) => (
                                            <p key={i}><span style={{ color: '#6b7280', marginRight: '8px' }}>-</span>{benefit}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {content.agency_types.outro && (
                                <p className="text-center mt-8 text-sm" style={{ color: '#9ca3af' }}>
                                    {content.agency_types.outro}
                                </p>
                            )}
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 5. FOSTERING SERVICES SECTION */}
            {content?.fostering_services && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="services">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>
                                {content.fostering_services.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                                {content.fostering_services.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.fostering_services.services.map((service: { name: string; description: string; slug: string }, i: number) => {
                                const linkUrl = `/locations/${countrySlug}/${location.slug}/${service.slug}`;
                                return (
                                    <FadeInSection key={i}>
                                        <Link 
                                            href={linkUrl}
                                            className="block p-6 rounded-xl transition-all group"
                                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        >
                                            <h3 className="font-semibold mb-2 group-hover:text-green-600" style={{ color: '#111827', fontWeight: 600 }}>{service.name}</h3>
                                            <p className="text-sm" style={{ color: '#374151' }}>{service.description}</p>
                                            <span className="text-xs font-medium text-green-600 mt-3 block">Learn more &rarr;</span>
                                        </Link>
                                    </FadeInSection>
                                );
                            })}
                        </div>

                        {content.fostering_services.outro && (
                            <p className="text-center mt-8 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{content.fostering_services.outro}</p>
                        )}
                    </div>
                </section>
            )}

            {/* 6. SUPPORT FOR FOSTER CARERS SECTION */}
            {content?.support && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }} id="support">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>
                                {content.support.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                                {content.support.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-2 gap-6">
                            {content.support.categories.map((item: { name: string; description: string }, i: number) => (
                                <FadeInSection key={i}>
                                    <div className="flex gap-4 p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}>
                                            {i === 0 && <GraduationCap className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                            {i === 1 && <Clock className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                            {i === 2 && <Wallet className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                            {i === 3 && <Users className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                            {i === 4 && <MessageCircle className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                            {i === 5 && <MapPin className="w-6 h-6" style={{ color: '#16a34a' }} />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1" style={{ color: '#111827', fontWeight: 600 }}>{item.name}</h3>
                                            <p className="text-sm" style={{ color: '#374151' }}>{item.description}</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. GLOSSARY SECTION */}
            {content?.glossary && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="glossary">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center gap-3 mb-8 justify-center">
                                <BookOpen className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <h2 className="text-xl font-semibold" style={{ color: '#ffffff', fontWeight: 700 }}>{content.glossary.heading}</h2>
                            </div>

                            <Accordion type="single" collapsible className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                                {content.glossary.terms.map((term: { term: string; definition: string }, i: number) => (
                                    <AccordionItem key={i} value={`term-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <AccordionTrigger className="text-left font-medium px-6 hover:no-underline" style={{ color: '#f3f4f6', fontWeight: 600, padding: '16px 24px' }}>
                                            {term.term}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 pt-2" style={{ color: '#9ca3af', padding: '16px 24px 24px' }}>
                                            {term.definition}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 8. FAQ SECTION */}
            {content?.faq && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="faq">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center gap-3 mb-8 justify-center">
                                <HelpCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <h2 className="text-xl font-semibold" style={{ color: '#ffffff', fontWeight: 700 }}>{content.faq.heading}</h2>
                            </div>

                            <Accordion type="single" collapsible className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                                {content.faq.questions.map((faq: { question: string; answer: string }, i: number) => (
                                    <AccordionItem key={i} value={`faq-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <AccordionTrigger className="text-left font-medium px-6 hover:no-underline" style={{ color: '#f3f4f6', fontWeight: 600, padding: '16px 24px' }}>
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 pt-2" style={{ color: '#9ca3af', padding: '16px 24px 24px' }}>
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 9. CTA SECTION */}
            {content?.cta && (
                <section ref={ctaRef} className="py-14 md:py-24 text-center" style={{ backgroundColor: '#22c55e', paddingTop: '56px', paddingBottom: '56px' }} id="cta">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#ffffff', fontWeight: 700, fontSize: '30px' }}>
                                {content.cta.heading}
                            </h2>
                            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                {content.cta.paragraph}
                            </p>
                            <Button size="lg" style={{ backgroundColor: '#ffffff', color: '#16a34a', fontWeight: 700, borderRadius: '8px', padding: '14px 32px' }} className="hover:bg-green-50 hover:scale-[1.02] transition-all duration-200" asChild>
                                <Link href="#agencies">
                                    {content.cta.button_text}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
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
    const ratingColor = ofstedRating === 'Outstanding' ? 'bg-green-100 text-green-800' : ofstedRating === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
    
    return (
        <div className="p-6 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold" style={{ color: '#111827' }}>{agency.name}</h3>
                        {agency.agency_type && <span className="text-xs px-2 py-0.5 rounded" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>{agency.agency_type}</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-2" style={{ color: '#6b7280' }}>
                        {ofstedRating !== 'Not rated' && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ratingColor}`}>
                                <Star className="w-3 h-3 mr-1 fill-current" style={{ color: ofstedRating === 'Outstanding' ? '#16a34a' : '#2563eb' }} />
                                Ofsted: {ofstedRating}
                            </span>
                        )}
                        {agency.city && <span>{agency.city}</span>}
                    </div>
                    {agency.short_description && <p className="text-sm line-clamp-2" style={{ color: '#374151' }}>{agency.short_description}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="w-full rounded-lg text-sm font-medium" style={{ backgroundColor: '#0f1117', color: 'white', borderRadius: '8px', padding: '10px 20px' }} asChild>
                        <Link href={`/agencies/${agency.slug}`}>View Agency</Link>
                    </Button>
                    <Button variant="outline" className="w-full rounded-lg text-sm" style={{ borderColor: '#e5e7eb', color: '#374151', borderRadius: '8px', padding: '10px 20px' }} asChild>
                        <Link href={`/agencies/${agency.slug}#contact`}>Contact Agency</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
