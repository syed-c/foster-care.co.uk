"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Heart, Users, GraduationCap, Home, CheckCircle, Info, Sparkles, MessageCircle, Quote, Activity, Award, Shield, Phone, Clock, BookOpen, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Location, Agency, FAQ } from "@/services/dataService";
import { AgencyListings } from "@/components/location/AgencyListings";
import { CollapsibleFAQ } from "./shared/CollapsibleFAQ";
import { SectionIntro } from "./shared/SectionIntro";
import { InteractiveCard } from "./shared/InteractiveCard";
import { ScrollReveal, ScrollRevealItem } from "./shared/ScrollReveal";
import { CountyContentData } from "@/hooks/useCountyContent";

interface CountyTemplateProps {
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
    countyContent: CountyContentData | null;
}

export function CountyTemplate({
    location,
    agencies,
    faqs,
    stats,
    path,
    countyContent
}: CountyTemplateProps) {
    const locationName = location.name;
    const content = countyContent;

    if (!content) {
        return null;
    }

    const replaceCountyPlaceholder = (text: string) => {
        return text.replace(/\[County\]/g, locationName);
    };

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white">
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-48 overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/locations/generic-hero.png"
                        alt={`Fostering in ${locationName}`}
                        className="w-full h-full object-cover opacity-20 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/50" />
                </div>

                <div className="container-main relative z-10 px-4">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <ScrollReveal effect="slideRight">
                            <div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[11px]">
                                    <Sparkles className="w-3.5 h-3.5 mr-2 inline" />
                                    Foster Care Directory
                                </Badge>

                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
                                    {replaceCountyPlaceholder(content.title)}
                                </h1>

                                <div className="space-y-4 mb-12">
                                    {content.intro.paragraphs.map((paragraph, index) => (
                                        <p key={index} className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium max-w-xl">
                                            {replaceCountyPlaceholder(paragraph)}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-18 px-12 text-xl shadow-2xl shadow-primary/30" asChild>
                                        <Link href="/agencies">
                                            {replaceCountyPlaceholder(content.cta.button_text)}
                                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    </Button>
                                    <div className="flex items-center gap-4 p-2 bg-white/5 rounded-full border border-white/10 pr-6">
                                        <div className="flex -space-x-3 ml-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Carer" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-tight">
                                            Join {stats.agenciesCount * 12}+ Carers <br /> in {locationName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal effect="slideLeft" className="hidden lg:grid grid-cols-2 gap-6">
                            <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md" hoverLift={true}>
                                <div className="text-4xl lg:text-5xl font-black text-primary mb-2 italic">{stats.childrenInCare.toLocaleString()}</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">{locationName} Kids in Care</div>
                            </InteractiveCard>
                            <InteractiveCard className="p-8 bg-white/5 border-white/10 backdrop-blur-md mt-12" hoverLift={true}>
                                <div className="text-4xl lg:text-5xl font-black text-white mb-2 italic">{stats.agenciesCount}</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">Local Agencies</div>
                            </InteractiveCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 2. Local Character Section */}
            <section className="py-24 md:py-32 bg-background-sand overflow-hidden">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Local Character"
                            heading={replaceCountyPlaceholder(content.local_character.heading)}
                        />
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mt-16">
                        <ScrollReveal effect="slideRight" className="relative group">
                            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group-hover:-rotate-1 transition-transform duration-500">
                                <img
                                    src="/images/locations/generic-hero.png"
                                    alt={`${locationName} landscape`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
                        </ScrollReveal>

                        <ScrollReveal effect="slideLeft">
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
                                {content.local_character.paragraphs.map((paragraph, index) => (
                                    <p key={index}>
                                        {replaceCountyPlaceholder(paragraph)}
                                    </p>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 3. Agency Network Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Local Agencies"
                            heading={replaceCountyPlaceholder(content.agency_network.heading)}
                            subheading={replaceCountyPlaceholder(content.agency_network.intro)}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            {content.agency_network.towns.map((town, index) => (
                                <Badge key={index} variant="outline" className="px-6 py-3 text-lg font-semibold rounded-full border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {town}
                                </Badge>
                            ))}
                        </div>
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.3} className="mt-8 text-center">
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            {replaceCountyPlaceholder(content.agency_network.outro)}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* 4. Types of Fostering Section */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Fostering Types"
                            heading={replaceCountyPlaceholder(content.types_of_fostering.heading)}
                            subheading={replaceCountyPlaceholder(content.types_of_fostering.intro)}
                        />
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                        {content.types_of_fostering.categories.map((category, index) => (
                            <ScrollReveal effect="slideUp" delay={index * 0.1} key={index}>
                                <InteractiveCard className="p-8 bg-white border-slate-100" hoverLift={true}>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">{category.name}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{category.description}</p>
                                </InteractiveCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Agency Types Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Your Options"
                            heading={replaceCountyPlaceholder(content.agency_types.heading)}
                            subheading={replaceCountyPlaceholder(content.agency_types.intro)}
                        />
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-8 mt-16">
                        <ScrollReveal effect="slideLeft">
                            <InteractiveCard className="p-10 bg-primary/5 border-2 border-primary/20" hoverLift={true}>
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Building2 className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">
                                    {replaceCountyPlaceholder(content.agency_types.independent.title)}
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {replaceCountyPlaceholder(content.agency_types.independent.description)}
                                </p>
                            </InteractiveCard>
                        </ScrollReveal>

                        <ScrollReveal effect="slideRight">
                            <InteractiveCard className="p-10 bg-slate-50 border-2 border-slate-200" hoverLift={true}>
                                <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center mb-6">
                                    <Shield className="w-7 h-7 text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">
                                    {replaceCountyPlaceholder(content.agency_types.local_authority.title)}
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {replaceCountyPlaceholder(content.agency_types.local_authority.description)}
                                </p>
                            </InteractiveCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 6. How to Become Section */}
            <section className="py-24 md:py-32 bg-slate-950 text-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Your Journey"
                            heading={replaceCountyPlaceholder(content.how_to_become.heading)}
                            subheading={replaceCountyPlaceholder(content.how_to_become.intro)}
                        />
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm">
                            <Clock className="w-4 h-4" />
                            {content.how_to_become.note}
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                        {content.how_to_become.steps.map((step, index) => (
                            <ScrollReveal effect="slideUp" delay={index * 0.1} key={index}>
                                <div className="relative p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-white">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 mt-2">{step.name}</h3>
                                    <p className="text-white/60 font-medium text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Ofsted Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Quality Assurance"
                            heading={replaceCountyPlaceholder(content.ofsted.heading)}
                            subheading={replaceCountyPlaceholder(content.ofsted.description)}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-12">
                        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {content.ofsted.criteria.map((criteria, index) => (
                                <div key={index} className="p-6 bg-slate-50 rounded-2xl text-center">
                                    <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <p className="font-bold text-slate-800">{criteria}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 8. Support Section */}
            <section className="py-24 md:py-32 bg-background-sand">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Support Available"
                            heading={replaceCountyPlaceholder(content.support.heading)}
                            subheading={replaceCountyPlaceholder(content.support.intro)}
                        />
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                        {content.support.categories.map((category, index) => (
                            <ScrollReveal effect="slideUp" delay={index * 0.1} key={index}>
                                <InteractiveCard className="p-8 bg-white border-slate-100" hoverLift={true}>
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                        {index === 0 && <Activity className="w-6 h-6 text-primary" />}
                                        {index === 1 && <Users className="w-6 h-6 text-primary" />}
                                        {index === 2 && <Clock className="w-6 h-6 text-primary" />}
                                        {index === 3 && <BookOpen className="w-6 h-6 text-primary" />}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{category.name}</h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{category.description}</p>
                                </InteractiveCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Landmarks Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="About the Area"
                            heading={replaceCountyPlaceholder(content.landmarks.heading)}
                            subheading={replaceCountyPlaceholder(content.landmarks.intro)}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.1} className="mt-8 text-center max-w-3xl mx-auto">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {replaceCountyPlaceholder(content.landmarks.paragraph)}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            {content.landmarks.places.map((place, index) => (
                                <Badge key={index} variant="outline" className="px-6 py-3 text-lg font-semibold rounded-full border-2 border-slate-200">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {place}
                                </Badge>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 10. Regions Section */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            eyebrow="Coverage"
                            heading={replaceCountyPlaceholder(content.regions.heading)}
                            subheading={replaceCountyPlaceholder(content.regions.intro)}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            {content.regions.list.map((region, index) => (
                                <Badge key={index} variant="outline" className="px-6 py-3 text-lg font-semibold rounded-full border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors">
                                    {region}
                                </Badge>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 11. Verified Agencies */}
            <section className="py-24 md:py-32 bg-white border-y border-slate-100">
                <div className="container-main">
                    <AgencyListings
                        agencies={agencies}
                        title={`Best Fostering Agencies in ${locationName}`}
                        subtitle={`We've hand-picked the highest rated agencies operating specifically within the ${locationName} area.`}
                        showFeaturedLabel={true}
                        locationName={locationName}
                    />
                </div>
            </section>

            {/* 12. FAQ Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container-main px-4 max-w-4xl mx-auto">
                    <ScrollReveal effect="slideUp">
                        <SectionIntro
                            heading={replaceCountyPlaceholder(content.faq.heading)}
                            center={true}
                        />
                    </ScrollReveal>

                    <ScrollReveal effect="slideUp" delay={0.2} className="mt-16">
                        <CollapsibleFAQ
                            items={content.faq.questions.map(q => ({
                                question: replaceCountyPlaceholder(q.question),
                                answer: replaceCountyPlaceholder(q.answer),
                                emoji: "💡"
                            }))}
                        />
                    </ScrollReveal>
                </div>
            </section>

            {/* 13. Responsibility Section */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                                {replaceCountyPlaceholder(content.responsibility.heading)}
                            </h2>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                {replaceCountyPlaceholder(content.responsibility.paragraph)}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 14. CTA Section */}
            <section className="py-24 md:py-32 bg-slate-950 text-white">
                <div className="container-main px-4">
                    <ScrollReveal effect="slideUp">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl font-black mb-8">
                                {replaceCountyPlaceholder(content.cta.heading)}
                            </h2>
                            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                                {replaceCountyPlaceholder(content.cta.paragraph)}
                            </p>
                            <Button size="lg" className="rounded-full group bg-primary hover:bg-primary/90 text-white font-black h-18 px-16 text-xl shadow-2xl shadow-primary/30" asChild>
                                <Link href="/agencies">
                                    {replaceCountyPlaceholder(content.cta.button_text)}
                                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
