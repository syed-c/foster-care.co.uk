"use client";

import {
    ShieldCheck,
    Lock,
    Eye,
    Search,
    ShieldAlert,
    PhoneCall,
    FileCheck,
    AlertCircle,
    UserCheck
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import {
    ContentHubHeader,
    IconGrid,
    ImageWithText,
    ProcessTimeline,
    MetricCounter,
    SupportCTAStrip
} from "@/components/content-hub";

export default function SafeguardingPage() {
    const safeguardingPillars = [
        {
            icon: Search,
            title: "Rigorous Vetting",
            description: "Enhanced DBS checks, local authority audits, and comprehensive personal references are standard for all carers.",
        },
        {
            icon: ShieldAlert,
            title: "Safe Home Audits",
            description: "Regular health and safety inspections ensure your home remains a secure environment for vulnerable children.",
        },
        {
            icon: Eye,
            title: "Active Monitoring",
            description: "Supervising social workers provide ongoing oversight, ensuring standards of care never falter.",
        }
    ];

    const vettingSteps = [
        {
            icon: FileCheck,
            title: "Enhanced DBS Check",
            description: "A thorough criminal record check for everyone in the household over the age of 18."
        },
        {
            icon: ShieldCheck,
            title: "Home Safety Review",
            description: "An audit of fire safety, security, and environmental hazards in your property."
        },
        {
            icon: UserCheck,
            title: "Health Assessment",
            description: "A medical report from your GP to ensure you have the physical and mental health to foster."
        },
        {
            icon: Search,
            title: "Personal References",
            description: "Interviews with people who have known you for years, including past partners and employers."
        }
    ];

    const metrics = [
        {
            value: 100,
            suffix: "%",
            label: "DBS Checked",
            icon: ShieldCheck
        },
        {
            value: 24,
            suffix: "/7",
            label: "Incident Reporting",
            icon: PhoneCall
        },
        {
            value: 4,
            label: "Annual Inspections",
            icon: Eye
        },
        {
            value: 99,
            suffix: "%",
            label: "Safety Compliance",
            icon: Lock
        }
    ];

    const faqs = [
        {
            question: "How long does the vetting process take?",
            answer: "The complete vetting process typically takes 4-6 months, including DBS checks, home safety reviews, health assessments, and reference interviews. We'll keep you informed at every stage."
        },
        {
            question: "What happens if something goes wrong during a placement?",
            answer: "We have 24/7 incident reporting channels and immediate support protocols. Your supervising social worker will work with you to address any concerns, and therapeutic support is available for both you and the child."
        },
        {
            question: "Are foster carers insured?",
            answer: "Yes, all approved foster carers are covered by comprehensive insurance including public liability, personal accident, and legal protection. This is provided by the fostering agency at no cost to you."
        },
        {
            question: "How often are home safety inspections conducted?",
            answer: "Initial home safety assessments are conducted during the approval process. After approval, annual inspections ensure your home continues to meet safety standards. Additional inspections may occur if circumstances change."
        }
    ];

    return (
        <>
            <SEOHead
                title="Safeguarding & Vetting Policy | Foster Care UK"
                description="Learn about our rigorous safeguarding and vetting processes for foster carers, including DBS checks, home safety audits, and continuous monitoring."
                canonicalUrl="https://www.foster-care.co.uk/policy/safeguarding"
                faqData={faqs}
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Safeguarding", url: "https://www.foster-care.co.uk/policy/safeguarding" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: Lock,
                        text: "Safety is Our Priority"
                    }}
                    title="Our"
                    titleHighlight="Safeguarding"
                    subtitle="Protecting children and supporting carers. Our rigorous standards create a foundation of trust and safety for everyone involved."
                    ctas={[
                        {
                            text: "Speak to a Safety Officer",
                            href: "/contact"
                        },
                        {
                            text: "Start Your Journey",
                            href: "/become-a-foster",
                            variant: "outline"
                        }
                    ]}
                    backgroundGradient="from-emerald-50/80 via-white to-green-50/50"
                />

                {/* Safeguarding Pillars */}
                <IconGrid
                    title="Our Safeguarding Framework"
                    subtitle="A comprehensive approach to ensuring the safety and wellbeing of children and foster families."
                    items={safeguardingPillars}
                    columns={3}
                />

                {/* Vetting Process */}
                <ImageWithText
                    eyebrow="Transparency"
                    title="Our Rigorous"
                    titleHighlight="Vetting Process"
                    description="We believe that comprehensive checks aren't just about security—they're about building a safe, trusting foundation for foster carers and children alike. Every step of our vetting process is designed to ensure the highest standards of care."
                    image={{
                        src: "/images/safeguarding-hero.jpg",
                        alt: "Child holding hands with adult",
                        fallback: "https://images.unsplash.com/photo-1484981138212-dc199320e897?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="right"
                />

                {/* Vetting Steps Timeline */}
                <ProcessTimeline
                    title="The Vetting Journey"
                    subtitle="A step-by-step look at our thorough assessment process to ensure child safety."
                    steps={vettingSteps}
                />

                {/* Metrics */}
                <MetricCounter metrics={metrics} />

                {/* Reporting & Support */}
                <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-lg border-4 border-primary/10 flex items-center justify-center shrink-0">
                                    <PhoneCall className="w-16 h-16 md:w-24 md:h-24 text-primary" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-slate-950">
                                        Reporting & Support
                                    </h2>
                                    <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-8">
                                        Safeguarding isn't just about prevention; it's about responsive action. We provide 24/7 incident reporting channels and immediate therapeutic support for both carers and children.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <div className="px-6 py-3 rounded-full bg-white border border-slate-200 text-primary font-bold text-sm shadow-sm">
                                            24/7 Support Line
                                        </div>
                                        <div className="px-6 py-3 rounded-full bg-white border border-slate-200 text-primary font-bold text-sm shadow-sm">
                                            Crisis Intervention
                                        </div>
                                        <div className="px-6 py-3 rounded-full bg-white border border-slate-200 text-primary font-bold text-sm shadow-sm">
                                            Legal Protection
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <AlertCircle className="w-4 h-4" />
                                Safeguarding FAQs
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-950 tracking-tight">
                                Your Safety Questions
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                Clear answers about our safeguarding procedures and what to expect.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border-none rounded-3xl bg-slate-50 px-6 md:px-8 py-2 shadow-sm hover:shadow-md transition-shadow"
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
                    icon={ShieldCheck}
                    title="Questions About Our Safety Standards?"
                    description="Our safeguarding team is available to discuss our vetting process, safety protocols, and ongoing monitoring procedures."
                    ctas={[
                        {
                            text: "Speak to Safety Team",
                            href: "/contact"
                        },
                        {
                            text: "View Training Standards",
                            href: "/policy/training",
                            variant: "outline"
                        }
                    ]}
                />
            </main>
        </>
    );
}
