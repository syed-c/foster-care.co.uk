"use client";

import { useRef, useEffect } from "react";
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
    CheckCircle,
    Scale,
    ShieldCheck,
    Heart,
    HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function CountyTemplate({ location, childLocations, agencies, stats, path, contentSlug }: CountyTemplateProps) {
    const { data: locationContent, isLoading } = useLocationContent(contentSlug || location.slug);
    const locationName = location.name;
    const heroRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const regionSlug = location.slug.split('-')[0];
    const regionName = path && path.length > 1 ? path[path.length - 2]?.name : '';

    const c = locationContent?.content;

    if (isLoading) {
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
            {/* 1. HERO SECTION - DARK */}
            <section ref={heroRef} className="relative py-14 md:py-24 overflow-hidden" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="hero">
                <div className="relative mx-auto px-4" style={{ maxWidth: '1100px' }}>
                    <FadeInSection>
                        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6b7280' }}>
                            <Link href="/locations" className="hover:text-white transition-colors">England</Link>
                            <span style={{ color: '#4b5563' }}>›</span>
                            {regionName && (<>
                                <Link href={`/locations/england/${regionSlug}`} className="hover:text-white transition-colors">{regionName}</Link>
                                <span style={{ color: '#4b5563' }}>›</span>
                            </>)}
                            <span style={{ color: '#9ca3af' }}>{locationName}</span>
                        </nav>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.2 }}>
                            Fostering Agencies in {locationName}
                        </h1>
                        <p className="text-lg mb-8" style={{ color: '#9ca3af', maxWidth: '560px', fontSize: '18px', lineHeight: 1.75 }}>
                            Find Ofsted-regulated fostering agencies in {locationName}. Compare local support, training, and allowances.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
                                <Shield className="w-3 h-3 mr-1" style={{ color: '#22c55e' }} />Ofsted-Regulated
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
                                <MapPin className="w-3 h-3 mr-1" style={{ color: '#22c55e' }} />Local Coverage
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
                                <Users className="w-3 h-3 mr-1" style={{ color: '#22c55e' }} />24/7 Support
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" style={{ backgroundColor: '#22c55e', color: 'white', borderRadius: '8px', padding: '14px 28px', fontWeight: 600 }} className="hover:translate-y-[-2px] transition-transform duration-200" asChild>
                                <Link href="#agencies">Find a Fostering Agency in {locationName}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                            </Button>
                            <Button variant="ghost" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', padding: '14px 28px' }} className="hover:translate-y-[-2px] transition-transform duration-200" onClick={() => ctaRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                                <Phone className="w-4 h-4 mr-2" />Speak to a Local Fostering Expert
                            </Button>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* 2. INTRO - LIGHT */}
            <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="intro">
                <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                    <FadeInSection>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#111827', fontWeight: 700 }}>About Fostering in {locationName}</h2>
                        <div className="space-y-4">
                            <p style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}>Fostering provides temporary or permanent homes for children who cannot live with their birth families. In {locationName}, local authorities and independent fostering agencies work together to ensure children receive quality care close to their schools, friends, and communities.</p>
                            <p style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}>Across England, there is ongoing demand for foster carers in every county, including {locationName}. Children in care come from diverse backgrounds and have varying needs.</p>
                            <p style={{ color: '#374151', fontSize: '16px', lineHeight: 1.75 }}><strong style={{ color: '#111827' }}>Who can foster in {locationName}?</strong> You don't need specific qualifications. What matters most is your ability to provide a safe, stable, and nurturing home. Most agencies welcome applicants who are over 21, have a spare bedroom, and can pass relevant checks.</p>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* 3. LOCAL CHARACTER - DARK-2 */}
            {c?.local_character && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#1a1d27', paddingTop: '56px', paddingBottom: '56px' }} id="local-character">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#ffffff', fontWeight: 700 }}>{c.local_character.heading}</h2>
                            <div className="space-y-4">
                                {(c.local_character.paragraphs || []).map((paragraph, i) => (
                                    <p key={i} style={{ color: '#d1d5db', fontSize: '16px', lineHeight: 1.75 }}>{paragraph}</p>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 4. AGENCY NETWORK - LIGHT */}
            {c?.agency_network && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="agency-network">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>{c.agency_network.heading}</h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{c.agency_network.intro}</p>
                            
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {(c.agency_network.towns || []).map((town, i) => (
                                    <span key={i} className="inline-block px-4 py-2 rounded-md text-sm" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151' }}>
                                        {town}
                                    </span>
                                ))}
                            </div>

                            <p className="text-center max-w-2xl mx-auto" style={{ color: '#374151' }}>{c.agency_network.outro}</p>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 5. TYPES OF FOSTERING - LIGHT-2 */}
            {c?.types_of_fostering && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }} id="types">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>{c.types_of_fostering.heading}</h2>
                            <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{c.types_of_fostering.intro}</p>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(c.types_of_fostering.categories || []).map((category, i) => {
                                    const serviceSlug = category.slug?.replace('-fostering', '') || category.url?.replace('/', '').replace('-fostering', '') || 'short-term';
                                    const linkUrl = category.url 
                                        ? `/locations/england/${location.slug}/${serviceSlug}`
                                        : `/locations/england/${location.slug}/${serviceSlug}`;
                                    
                                    return (
                                        <Link 
                                            key={i} 
                                            href={linkUrl}
                                            className="block p-6 rounded-xl transition-all group"
                                            style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        >
                                            <h3 className="font-semibold mb-2 group-hover:text-green-600" style={{ color: '#111827', fontWeight: 600 }}>{category.name}</h3>
                                            <p className="text-sm" style={{ color: '#374151' }}>{category.description}</p>
                                        </Link>
                                    );
                                })}
                            </div>

                            {c.types_of_fostering.outro && (
                                <p className="text-center mt-8 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{c.types_of_fostering.outro}</p>
                            )}
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 6. AGENCY TYPES (IFA vs LA) - DARK */}
            <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="agency-types">
                <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                    <FadeInSection>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#ffffff', fontWeight: 700 }}>Independent Agencies vs Local Authority in {locationName}</h2>
                        <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>Understanding your options helps you choose the right fostering path.</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#22c55e' }}>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                    <Building2 className="w-5 h-5" style={{ color: '#22c55e' }} />Independent Fostering Agencies
                                </h3>
                                <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                    <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> Dedicated social worker, 24/7 on-call, smaller caseloads.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Allowances:</strong> Competitive rates, flexible expenses.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Training:</strong> Comprehensive initial and ongoing training.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Best for:</strong> New carers wanting intensive support.</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderTopWidth: '3px', borderTopColor: '#6b7280' }}>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff', fontWeight: 700 }}>
                                    <Shield className="w-5 h-5" style={{ color: '#6b7280' }} />Local Authority Fostering
                                </h3>
                                <div className="space-y-4 text-sm" style={{ color: '#d1d5db' }}>
                                    <p><strong style={{ color: '#f3f4f6' }}>Support:</strong> Assigned social worker, regular visits.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Allowances:</strong> Standard national rates.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Training:</strong> Core programmes, in-house training.</p>
                                    <p><strong style={{ color: '#f3f4f6' }}>Best for:</strong> Those prioritising keeping children local.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center mt-8 text-sm" style={{ color: '#9ca3af' }}>Both options provide rewarding fostering experiences. The right choice depends on your circumstances and preferences.</p>
                    </FadeInSection>
                </div>
            </section>

            {/* 7. HOW TO BECOME - LIGHT */}
            {c?.how_to_become && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="how-to-become">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#111827', fontWeight: 700 }}>{c.how_to_become.heading}</h2>
                            <p className="mb-10" style={{ color: '#6b7280' }}>{c.how_to_become.intro}</p>

                            <div className="space-y-8 relative" style={{ paddingLeft: '48px' }}>
                                {(c.how_to_become.steps || []).map((step, i) => (
                                    <div key={i} className="relative">
                                        <div 
                                            className="absolute flex items-center justify-center font-bold text-white"
                                            style={{ 
                                                left: '-48px', 
                                                top: '0',
                                                width: '32px', 
                                                height: '32px', 
                                                borderRadius: '50%', 
                                                backgroundColor: '#22c55e',
                                                fontWeight: 700
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        {i < (c.how_to_become.steps?.length || 0) - 1 && (
                                            <div 
                                                className="absolute hidden md:block" 
                                                style={{ 
                                                    left: '-32px', 
                                                    top: '36px', 
                                                    width: '2px', 
                                                    height: 'calc(100% + 8px)',
                                                    backgroundColor: '#e5e7eb'
                                                }}
                                            ></div>
                                        )}
                                        <div className="pt-1">
                                            <h3 className="font-semibold mb-1" style={{ color: '#1f2937', fontWeight: 600 }}>{step.name}</h3>
                                            <p className="text-sm" style={{ color: '#374151' }}>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {c.how_to_become.note && (
                                <p className="mt-8 text-sm italic pl-4" style={{ color: '#6b7280', borderLeft: '2px solid #e5e7eb' }}>
                                    {c.how_to_become.note}
                                </p>
                            )}
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 8. OFSTED - DARK-2 */}
            {c?.ofsted && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#1a1d27', paddingTop: '56px', paddingBottom: '56px' }} id="ofsted">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center gap-3 mb-6">
                                <Scale className="w-6 h-6" style={{ color: '#22c55e' }} />
                                <h2 className="text-2xl font-semibold" style={{ color: '#ffffff', fontWeight: 700 }}>{c.ofsted.heading}</h2>
                            </div>
                            <p className="mb-8 leading-relaxed" style={{ color: '#d1d5db' }}>{c.ofsted.description}</p>

                            <div className="space-y-0">
                                {(c.ofsted.criteria || []).map((criteria, i) => (
                                    <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                                        <span style={{ color: '#d1d5db' }}>{criteria}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 9. SUPPORT - LIGHT-2 */}
            {c?.support && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }} id="support">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center" style={{ color: '#111827', fontWeight: 700 }}>{c.support.heading}</h2>
                            <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: '#6b7280' }}>{c.support.intro}</p>

                            <div className="grid md:grid-cols-3 gap-6">
                                {(c.support.categories || []).map((category, i) => (
                                    <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                        <h3 className="font-semibold mb-2" style={{ color: '#111827', fontWeight: 600 }}>{category.name}</h3>
                                        <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{category.description}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 10. LANDMARKS - DARK */}
            {c?.landmarks && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#0f1117', paddingTop: '56px', paddingBottom: '56px' }} id="landmarks">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center" style={{ color: '#ffffff', fontWeight: 700 }}>{c.landmarks.heading}</h2>
                            <p className="text-center mb-6 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>{c.landmarks.intro}</p>
                            <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>{c.landmarks.paragraph}</p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {(c.landmarks.places || []).map((place, i) => (
                                    <div key={i} className="py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#22c55e' }}>●</span> {place}
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 11. REGIONS / TOWNS - LIGHT */}
            {c?.regions && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }} id="regions">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: '#111827', fontWeight: 700 }}>{c.regions.heading}</h2>
                            <p className="text-center mb-8" style={{ color: '#6b7280' }}>{c.regions.intro}</p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {(c.regions.list || []).map((area, i) => {
                                    const areaName = typeof area === 'object' ? area.county : area;
                                    return (
                                        <span key={i} className="inline-block px-4 py-2 rounded-md text-sm transition-colors cursor-pointer hover:bg-green-100 hover:border-green-600 hover:text-green-700" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', fontSize: '14px', margin: '4px' }}>
                                            {areaName}
                                        </span>
                                    );
                                })}
                            </div>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 12. FAQ - LIGHT-2 */}
            {c?.faq && (
                <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }} id="faq">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center gap-3 mb-8 justify-center">
                                <HelpCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <h2 className="text-xl font-semibold" style={{ color: '#111827', fontWeight: 700 }}>{c.faq.heading}</h2>
                            </div>

                            <Accordion type="single" collapsible className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                {(c.faq.questions || []).map((faq, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <AccordionTrigger className="text-left font-medium px-6 hover:no-underline hover:bg-gray-50" style={{ color: '#111827', fontWeight: 600, padding: '16px 24px' }}>
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 pt-2" style={{ color: '#374151', padding: '16px 24px 24px' }}>
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 13. RESPONSIBILITY - DARK-2 */}
            {c?.responsibility && (
                <section className="py-14" style={{ backgroundColor: '#1a1d27', paddingTop: '56px', paddingBottom: '56px' }} id="responsibility">
                    <div className="mx-auto px-4 text-center" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5" style={{ color: '#22c55e' }} />
                                <h2 className="text-lg font-semibold" style={{ color: '#ffffff', fontWeight: 700 }}>{c.responsibility.heading}</h2>
                            </div>
                            <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>{c.responsibility.paragraph}</p>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* 14. CTA - BRAND GREEN */}
            {c?.cta && (
                <section ref={ctaRef} className="py-14 md:py-24 text-center" style={{ backgroundColor: '#22c55e', paddingTop: '56px', paddingBottom: '56px' }} id="cta">
                    <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                        <FadeInSection>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#ffffff', fontWeight: 700, fontSize: '30px' }}>{c.cta.heading}</h2>
                            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.cta.paragraph}</p>
                            <Button size="lg" style={{ backgroundColor: '#ffffff', color: '#16a34a', fontWeight: 700, borderRadius: '8px', padding: '14px 32px' }} className="hover:bg-green-50 hover:scale-[1.02] transition-all duration-200" asChild>
                                <Link href="/become-a-foster">
                                    {c.cta.button_text}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* Fallback: If no JSONB content, render default sections */}
            {!c && (
                <>
                    {/* AGENCIES LIST - LIGHT when no content */}
                    <section id="agencies" className="py-14 md:py-24" style={{ backgroundColor: '#ffffff', paddingTop: '56px', paddingBottom: '56px' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <FadeInSection>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>Fostering Agencies in {locationName}</h2>
                                <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>Verified agencies operating in {locationName}.</p>
                                {agencies && agencies.length > 0 ? (
                                    <div className="space-y-4">{agencies.slice(0, 10).map((agency) => <AgencyCard key={agency.id} agency={agency} />)}</div>
                                ) : (
                                    <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                        <Building2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#d1d5db' }} />
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>No Agencies Found</h3>
                                        <p className="max-w-md mx-auto" style={{ color: '#6b7280' }}>We don't have agencies specifically listed for {locationName} yet.</p>
                                    </div>
                                )}
                            </FadeInSection>
                        </div>
                    </section>

                    {/* WHAT AGENCIES PROVIDE - LIGHT */}
                    <section className="py-14 md:py-24" style={{ backgroundColor: '#f8f9fa', paddingTop: '56px', paddingBottom: '56px' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <FadeInSection>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: '#111827', fontWeight: 700 }}>What Fostering Agencies in {locationName} Provide</h2>
                                <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>All registered fostering agencies offer core support services.</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { icon: GraduationCap, title: "Training and Development", desc: "Preparation training and ongoing skills development." },
                                        { icon: Clock, title: "24/7 Support", desc: "Round-the-clock access to guidance and emergency support." },
                                        { icon: Wallet, title: "Financial Allowances", desc: "Weekly maintenance to cover child's living costs." },
                                        { icon: Users, title: "Social Worker Support", desc: "Dedicated supervising social worker." },
                                        { icon: MessageCircle, title: "Peer Support Networks", desc: "Access to support groups and peer networks." },
                                        { icon: MapPin, title: "Local Placement Matching", desc: "Keeping children in their local area." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}><item.icon className="w-6 h-6" style={{ color: '#16a34a' }} /></div>
                                            <div>
                                                <h3 className="font-semibold mb-1" style={{ color: '#111827', fontWeight: 600 }}>{item.title}</h3>
                                                <p className="text-sm" style={{ color: '#374151' }}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FadeInSection>
                        </div>
                    </section>

                    {/* FALLBACK CTA - BRAND */}
                    <section ref={ctaRef} className="py-14 md:py-24 text-center" style={{ backgroundColor: '#22c55e', paddingTop: '56px', paddingBottom: '56px' }}>
                        <div className="mx-auto px-4" style={{ maxWidth: '1100px' }}>
                            <FadeInSection>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#ffffff', fontWeight: 700, fontSize: '30px' }}>Thinking About Fostering in {locationName}?</h2>
                                <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>Every child deserves a safe, stable home. We're here to help you find the right path.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button size="lg" style={{ backgroundColor: '#ffffff', color: '#16a34a', fontWeight: 700, borderRadius: '8px', padding: '14px 32px' }} className="hover:bg-green-50 hover:scale-[1.02] transition-all duration-200" asChild>
                                        <Link href="#agencies">Find a Fostering Agency in {locationName}<ArrowRight className="w-4 h-4 ml-2" /></Link>
                                    </Button>
                                    <Button size="lg" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', borderRadius: '8px', padding: '14px 32px' }} className="hover:bg-white/10 transition-colors" asChild>
                                        <Link href="/contact">Get Fostering Advice</Link>
                                    </Button>
                                </div>
                            </FadeInSection>
                        </div>
                    </section>
                </>
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
