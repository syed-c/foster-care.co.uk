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
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Location, Agency } from "@/services/dataService";
import { useLocationContent } from "@/hooks/useLocationContent";

export interface CountyTemplateProps {
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

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
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

export function CountyTemplate({ location, childLocations, agencies, stats, path, contentSlug, initialContent }: CountyTemplateProps) {
    const { data: locationContent, isLoading } = useLocationContent(contentSlug || location.slug);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const regionSlug = location.slug.split('-')[0];
    const regionName = path && path.length > 1 ? path[path.length - 2]?.name : '';
    const countrySlug = path && path.length > 0 ? path[0]?.slug : 'england';

    const rawContent = initialContent || locationContent?.content;
    
    const c = rawContent ? {
        hero: rawContent.hero || rawContent.intro ? {
            heading: rawContent.hero?.heading || `Fostering in ${locationName}`,
            subheading: rawContent.hero?.subheading || rawContent.intro?.paragraphs?.[0] || '',
            cta_primary: rawContent.hero?.cta_primary || 'Find an Agency',
            cta_secondary: rawContent.hero?.cta_secondary || 'Talk to Us',
            trust_badges: rawContent.hero?.trust_badges || ['Ofsted Registered', 'Verified Agencies']
        } : undefined,
        about: rawContent.about || rawContent.why_fostering_matters ? {
            heading: rawContent.about?.heading || rawContent.why_fostering_matters?.heading || `About Fostering in ${locationName}`,
            paragraphs: rawContent.about?.paragraphs || rawContent.why_fostering_matters?.paragraphs || []
        } : undefined,
        agency_types: rawContent.agency_types,
        fostering_services: rawContent.fostering_services || rawContent.types_of_fostering ? {
            heading: rawContent.fostering_services?.heading || rawContent.types_of_fostering?.heading || 'Types of Fostering',
            intro: rawContent.fostering_services?.intro || rawContent.types_of_fostering?.intro || '',
            outro: rawContent.fostering_services?.outro || rawContent.types_of_fostering?.outro || '',
            services: rawContent.fostering_services?.services || rawContent.types_of_fostering?.categories?.map((cat: any) => ({
                name: cat.name,
                description: cat.description,
                slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
            })) || []
        } : undefined,
        support: rawContent.support,
        faq: rawContent.faq,
        cta: rawContent.cta
    } : null;

    const isInitialLoading = isLoading && !c;

    if (isInitialLoading) {
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
            {/* 1. HERO SECTION - Only render if hero data exists */}
            {c?.hero && (
                <section ref={heroRef} className="relative py-14 md:py-24 overflow-hidden" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="hero">
                    <div className="relative mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <nav className="flex items-center gap-2 text-sm mb-6 mt-12" style={{ color: '#6b7280', fontSize: '13px' }}>
                                <Link href="/locations" className="hover:text-white transition-colors">England</Link>
                                <span style={{ color: '#374151' }}>&rsaquo;</span>
                                {regionName && (<>
                                    <Link href={`/locations/${countrySlug}/${regionSlug}`} className="hover:text-white transition-colors">{regionName}</Link>
                                    <span style={{ color: '#374151' }}>&rsaquo;</span>
                                </>)}
                                <span style={{ color: '#9ca3af' }}>{locationName}</span>
                            </nav>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2 }}>
                                {c.hero.heading}
                            </h1>
                            <p className="text-lg mb-8" style={{ color: '#9ca3af', maxWidth: '560px', fontSize: '18px', lineHeight: 1.75 }}>
                                {c.hero.subheading}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                {(c.hero.trust_badges || []).map((badge, i) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {c.hero.cta_primary && (
                                    <Button size="lg" style={{ backgroundColor: '#22c55e', color: 'white', borderRadius: '8px', padding: '14px 28px', fontWeight: 600 }} className="hover:translate-y-[-2px] transition-transform duration-200" asChild>
                                        <Link href="#agencies">{c.hero.cta_primary}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                                    </Button>
                                )}
                                {c.hero.cta_secondary && (
                                    <Button variant="ghost" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', padding: '14px 28px' }} className="hover:translate-y-[-2px] transition-transform duration-200" onClick={() => ctaRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                        <Phone className="w-4 h-4 mr-2" />{c.hero.cta_secondary}
                                    </Button>
                                )}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 2. ABOUT SECTION - Only render if about data exists */}
            {c?.about && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="about">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#111827', fontWeight: 700 }}>
                                {c.about.heading}
                            </h2>
                            <div className="space-y-4">
                                {c.about.paragraphs.map((paragraph, i) => (
                                    <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}>{paragraph}</p>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 3. AGENCIES SECTION - Dynamic from DB - Always render */}
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

            {/* 4. AGENCY TYPES SECTION - Only render if agency_types data exists */}
            {c?.agency_types && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="agency-types">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#ffffff', fontWeight: 700 }}>
                                {c.agency_types.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>
                                {c.agency_types.intro}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#22c55e' }}>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                        <Building2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                                        {c.agency_types.independent.title}
                                    </h3>
                                    <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                        <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> {c.agency_types.independent.description}</p>
                                        {c.agency_types.independent.benefits?.map((benefit, i) => (
                                            <p key={i}><span style={{ color: '#22c55e', marginRight: '8px' }}>-</span>{benefit}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#6b7280' }}>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                        <Shield className="w-5 h-5" style={{ color: '#6b7280' }} />
                                        {c.agency_types.local_authority.title}
                                    </h3>
                                    <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                        <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> {c.agency_types.local_authority.description}</p>
                                        {c.agency_types.local_authority.benefits?.map((benefit, i) => (
                                            <p key={i}><span style={{ color: '#6b7280', marginRight: '8px' }}>-</span>{benefit}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {c.agency_types.outro && (
                                <p className="text-center mt-8 text-sm" style={{ color: '#9ca3af' }}>
                                    {c.agency_types.outro}
                                </p>
                            )}
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 5. FOSTERING SERVICES SECTION - Only render if fostering_services data exists */}
            {c?.fostering_services && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="services">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>
                                {c.fostering_services.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                                {c.fostering_services.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {c.fostering_services.services.map((service, i) => {
                                const linkUrl = `/locations/${countrySlug}/${regionSlug}/${location.slug}/${service.slug}`;
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

                        {c.fostering_services.outro && (
                            <p className="text-center mt-8 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{c.fostering_services.outro}</p>
                        )}
                    </div>
                </section>
            )}

            {/* 6. WHAT AGENCIES PROVIDE SECTION - Only render if support data exists */}
            {c?.support && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }} id="support">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>
                                {c.support.heading}
                            </h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                                {c.support.intro}
                            </p>
                        </FadeInSection>

                        <div className="grid md:grid-cols-2 gap-6">
                            {c.support.categories.map((item, i) => (
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

            {/* 7. FAQ SECTION - Only render if faq data exists */}
            {c?.faq && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="faq">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center gap-3 mb-8 justify-center">
                                <HelpCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <h2 className="text-xl font-semibold" style={{ color: '#ffffff', fontWeight: 700 }}>{c.faq.heading}</h2>
                            </div>

                            <Accordion type="single" collapsible className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                                {c.faq.questions.map((faq, i) => (
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

            {/* 8. CTA SECTION - Only render if cta data exists */}
            {c?.cta && (
                <section ref={ctaRef} className="py-14 md:py-24 text-center" style={{ backgroundColor: '#22c55e', paddingTop: '56px', paddingBottom: '56px' }} id="cta">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#ffffff', fontWeight: 700, fontSize: '30px' }}>
                                {c.cta.heading}
                            </h2>
                            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                {c.cta.paragraph}
                            </p>
                            <Button size="lg" style={{ backgroundColor: '#ffffff', color: '#16a34a', fontWeight: 700, borderRadius: '8px', padding: '14px 32px' }} className="hover:bg-green-50 hover:scale-[1.02] transition-all duration-200" asChild>
                                <Link href="#agencies">
                                    {c.cta.button_text}
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
