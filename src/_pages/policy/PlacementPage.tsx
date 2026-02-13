"use client";

import {
    Home,
    Clock,
    ShieldCheck,
    Baby,
    Users,
    Briefcase,
    Network,
    SearchCheck,
    Heart
} from "lucide-react";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import {
    ContentHubHeader,
    IconGrid,
    ImageWithText,
    ProcessTimeline,
    TestimonialSlider,
    SupportCTAStrip
} from "@/components/content-hub";

export default function PlacementPage() {
    const placementTypes = [
        {
            icon: Clock,
            title: "Short-Term",
            description: "Providing stability while long-term plans are finalized. This can last from a few days to several months.",
        },
        {
            icon: Home,
            title: "Long-Term",
            description: "Children become a permanent part of your family until they reach adulthood and independence.",
        },
        {
            icon: ShieldCheck,
            title: "Emergency",
            description: "Immediate care for children who need a safe place within hours, often due to unforeseen circumstances.",
        },
        {
            icon: Baby,
            title: "Parent & Child",
            description: "A specialized placement where you support a parent and their infant together to help them stay as a family.",
        },
        {
            icon: Users,
            title: "Respite Care",
            description: "Short-term breaks (usually weekends) to support other foster families or special guardianship carers.",
        },
        {
            icon: Briefcase,
            title: "Therapeutic",
            description: "Care for children with complex emotional or behavioral needs who require specialist support frameworks.",
        }
    ];

    const matchingSteps = [
        {
            icon: SearchCheck,
            title: "Needs Assessment",
            description: "We analyze the child's specific background, health, and education needs."
        },
        {
            icon: Users,
            title: "Carer Profiling",
            description: "We look at your family's dynamic, experience, and available space."
        },
        {
            icon: Network,
            title: "Matching Panel",
            description: "Social workers work together to ensure the best cultural and emotional fit."
        },
        {
            icon: Heart,
            title: "Introduction",
            description: "Carefully planned introductions allow you and the child to get to know each other."
        }
    ];

    const testimonials = [
        {
            quote: "We started with short-term placements to build our confidence. Now we're providing long-term care for two wonderful children. The matching process was thorough and thoughtful.",
            author: "Claire and Tom Bennett",
            role: "Foster Carers for 4 years",
            initials: "CB"
        },
        {
            quote: "Emergency placements can be challenging, but knowing you're providing immediate safety for a child in crisis is incredibly rewarding. The support team is always there when we need them.",
            author: "Michael Foster",
            role: "Emergency Foster Carer for 3 years",
            initials: "MF"
        }
    ];

    return (
        <>
            <SEOHead
                title="Types of Foster Care Placements & Matching | Foster Care UK"
                description="Learn about the different types of foster care placements, including short-term, long-term, and emergency care. Understand the matching process."
                canonicalUrl="https://www.foster-care.co.uk/policy/placement"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Placements & Matching", url: "https://www.foster-care.co.uk/policy/placement" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: Network,
                        text: "Finding the Perfect Fit"
                    }}
                    title="Placement"
                    titleHighlight="Types"
                    subtitle="Every child is unique, and so is every home. Explore the different ways you can provide care and how we ensure a perfect match."
                    ctas={[
                        {
                            text: "Start Your Journey",
                            href: "/become-a-foster"
                        },
                        {
                            text: "Talk About Matching",
                            href: "/contact",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Placement Types */}
                <IconGrid
                    title="Ways You Can Care"
                    subtitle="Different fostering types require different levels of commitment. We'll help you find the one that fits your life and skills."
                    items={placementTypes}
                    columns={3}
                />

                {/* Matching Process */}
                <ImageWithText
                    eyebrow="The Science of Matching"
                    title="How We"
                    titleHighlight="Match You"
                    description="Successful fostering depends on a stable, compatible match. Our rigorous process ensures that both the carer and the child feel comfortable and safe. We consider cultural background, family dynamics, experience level, and the specific needs of each child."
                    image={{
                        src: "/images/matching-hero.jpg",
                        alt: "Child smiling with foster parent",
                        fallback: "https://images.unsplash.com/photo-1544333346-60195e263d6f?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="left"
                />

                {/* Matching Timeline */}
                <ProcessTimeline
                    title="The Matching Journey"
                    subtitle="From initial assessment to successful placement, here's how we ensure the best possible match."
                    steps={matchingSteps}
                />

                {/* Testimonials */}
                <TestimonialSlider testimonials={testimonials} />

                {/* Placement Considerations */}
                <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12 md:mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-950 tracking-tight">
                                    Which Placement is Right for You?
                                </h2>
                                <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                    Consider these factors when thinking about the type of fostering that suits your family.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-primary" />
                                        Time Commitment
                                    </h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        Short-term and respite care offer flexibility, while long-term and therapeutic placements require sustained commitment. Consider your work schedule and family obligations.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                        <Users className="w-6 h-6 text-primary" />
                                        Experience Level
                                    </h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        Emergency and therapeutic placements often require more experience. If you're new to fostering, short-term or long-term placements might be a better starting point.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                        <Home className="w-6 h-6 text-primary" />
                                        Space & Resources
                                    </h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        Parent & child placements require additional space. Consider the physical resources you have available and whether you can accommodate specific needs.
                                    </p>
                                </div>

                                <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                        <Heart className="w-6 h-6 text-primary" />
                                        Emotional Readiness
                                    </h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        All placements require emotional resilience, but therapeutic care demands additional skills in managing complex behaviors and trauma responses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support CTA */}
                <SupportCTAStrip
                    icon={Network}
                    title="Ready to Explore Placement Options?"
                    description="Our team can help you understand which type of fostering best suits your family, experience, and lifestyle."
                    ctas={[
                        {
                            text: "Discuss Placement Types",
                            href: "/contact"
                        },
                        {
                            text: "View Support Services",
                            href: "/policy/support",
                            variant: "outline"
                        }
                    ]}
                />
            </main>
        </>
    );
}
