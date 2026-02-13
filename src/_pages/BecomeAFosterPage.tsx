"use client";

import {
    UserPlus,
    Users,
    Home,
    ShieldCheck,
    Heart,
    Clock,
    BadgeCheck,
    HelpCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import {
    ContentHubHeader,
    IconGrid,
    ImageWithText,
    ProcessTimeline,
    TestimonialSlider,
    MetricCounter,
    SupportCTAStrip
} from "@/components/content-hub";

export default function BecomeAFosterPage() {
    const eligibilityCriteria = [
        {
            icon: Users,
            title: "Age & Residency",
            description: "You must be at least 21 years old and have the right to live and work in the UK.",
        },
        {
            icon: Home,
            title: "Spare Bedroom",
            description: "A spare room is essential to give a child their own private, stable space.",
        },
        {
            icon: ShieldCheck,
            title: "Stability",
            description: "Your home environment should be safe, stable, and nurturing for a child.",
        }
    ];

    const journeySteps = [
        {
            icon: UserPlus,
            title: "Initial Enquiry",
            description: "Get in touch and speak to our friendly team about your interest in fostering."
        },
        {
            icon: Home,
            title: "Home Assessment",
            description: "We'll visit your home to understand your family dynamic and living situation."
        },
        {
            icon: BadgeCheck,
            title: "Training & Approval",
            description: "Complete the 'Skills to Foster' course and attend your approval panel."
        },
        {
            icon: Heart,
            title: "Matching & Placement",
            description: "We'll carefully match you with a child who fits your family perfectly."
        }
    ];

    const testimonials = [
        {
            quote: "I was worried I was too old to foster, but the team reassured me that experience and stability matter more than age. Now I can't imagine my life without my foster daughter.",
            author: "Sarah Mitchell",
            role: "Foster Carer for 3 years",
            initials: "SM"
        },
        {
            quote: "As a single person renting my flat, I thought fostering was out of reach. The agency helped me understand that what matters is the love and commitment you can offer.",
            author: "James Chen",
            role: "Foster Carer for 18 months",
            initials: "JC"
        },
        {
            quote: "Working full-time and fostering is possible with the right support. My agency has been incredible in helping me balance both responsibilities.",
            author: "Priya Patel",
            role: "Foster Carer for 2 years",
            initials: "PP"
        }
    ];

    const metrics = [
        {
            value: 10000,
            suffix: "+",
            label: "Children Helped",
            icon: Heart
        },
        {
            value: 2500,
            suffix: "+",
            label: "Active Carers",
            icon: Users
        },
        {
            value: 95,
            suffix: "%",
            label: "Satisfaction Rate",
            icon: BadgeCheck
        },
        {
            value: 24,
            suffix: "/7",
            label: "Support Available",
            icon: Clock
        }
    ];

    const commonConcerns = [
        {
            question: "Do I need to be in a relationship?",
            answer: "No. You can be single, married, in a civil partnership, or cohabiting. What matters is your ability to support a child."
        },
        {
            question: "What if I rent my home?",
            answer: "Whether you own or rent, you can foster as long as your home is stable and you have permission from your landlord (if applicable) and a spare bedroom."
        },
        {
            question: "Can I foster if I have pets?",
            answer: "Yes, many foster carers have pets. As part of your assessment, a pet safety check will be carried out to ensure they are compatible with children."
        },
        {
            question: "Can I foster if I work full-time?",
            answer: "Many foster carers work. However, you must be able to attend school meetings, health appointments, and training. Some agencies require one carer to be available full-time for certain types of care."
        },
        {
            question: "Am I too old to foster?",
            answer: "There's no upper age limit for fostering. What matters is your health, energy, and ability to care for a child. Many successful foster carers are in their 50s, 60s, and beyond."
        },
        {
            question: "What if I've never had children of my own?",
            answer: "You don't need to have your own children to foster. Many excellent foster carers have never been parents before. The training and support we provide will prepare you for the role."
        }
    ];

    return (
        <>
            <SEOHead
                title="How to Become a Foster Carer - Guide & Eligibility | Foster Care UK"
                description="Discover how to become a foster carer in the UK. Learn about eligibility, requirements, the application process, and common concerns. Start your journey today."
                canonicalUrl="https://www.foster-care.co.uk/become-a-foster"
                faqData={commonConcerns}
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Become a Foster Carer", url: "https://www.foster-care.co.uk/become-a-foster" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: UserPlus,
                        text: "Your Fostering Journey Starts Here"
                    }}
                    title="Become a"
                    titleHighlight="Foster Carer"
                    subtitle="Open your heart and your home. Join thousands of families across the UK making a life-changing difference for children in need."
                    ctas={[
                        {
                            text: "Enquire Now",
                            href: "/contact"
                        },
                        {
                            text: "Check Eligibility",
                            href: "#eligibility",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Eligibility Section */}
                <IconGrid
                    title="Who Can Foster?"
                    subtitle="Fostering is inclusive. We welcome people from all walks of life, regardless of gender, marital status, or sexual orientation."
                    items={eligibilityCriteria}
                    columns={3}
                />

                {/* Requirements with Image */}
                <ImageWithText
                    eyebrow="The Essentials"
                    title="What You'll Need"
                    titleHighlight="to Get Started"
                    description="Beyond a spare room, fostering requires a specific set of qualities and commitments to ensure the best care for children. You'll need patience, empathy, and emotional resilience, along with the ability to provide a safe and nurturing environment."
                    bulletPoints={[
                        {
                            text: "Ability to provide a safe and nurturing environment"
                        },
                        {
                            text: "Flexibility to attend meetings and training sessions"
                        },
                        {
                            text: "Good communication skills for working with social workers"
                        },
                        {
                            text: "Financial stability (though you don't need to be wealthy)"
                        },
                        {
                            text: "A spare bedroom solely for the foster child"
                        },
                        {
                            text: "Reasonably healthy lifestyle and physical fitness"
                        }
                    ]}
                    image={{
                        src: "/images/become-foster-hero.jpg",
                        alt: "Prospective foster carer",
                        fallback: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="right"
                />

                {/* Metrics */}
                <MetricCounter metrics={metrics} />

                {/* Process Timeline */}
                <ProcessTimeline
                    title="Your Fostering Journey"
                    subtitle="From your first enquiry to welcoming a child into your home, we'll guide you through every step of the process."
                    steps={journeySteps}
                />

                {/* Testimonials */}
                <TestimonialSlider testimonials={testimonials} />

                {/* FAQ Section */}
                <section className="py-20 md:py-28 bg-background-sand">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <HelpCircle className="w-4 h-4" />
                                Common Concerns
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-950 tracking-tight">
                                Your Questions, Answered
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                We understand that deciding to foster is a big step. Here are honest answers to common worries.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {commonConcerns.map((faq, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border-none rounded-3xl bg-white px-6 md:px-8 py-2 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <AccordionTrigger className="text-lg md:text-xl font-bold hover:no-underline text-slate-950 py-5 md:py-6 text-left leading-tight group">
                                        <span className="group-hover:text-primary transition-colors">
                                            {faq.question}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-8 font-medium">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Support CTA */}
                <SupportCTAStrip
                    icon={Heart}
                    title="Ready to Change a Child's Life?"
                    description="Our team is here to answer your questions and guide you through every step of your fostering journey. Get in touch today to start making a difference."
                    ctas={[
                        {
                            text: "Speak to an Advisor",
                            href: "/contact"
                        },
                        {
                            text: "View Support Options",
                            href: "/policy/support",
                            variant: "outline"
                        }
                    ]}
                />
            </main>
        </>
    );
}
