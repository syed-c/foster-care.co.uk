"use client";

import {
    Coins,
    Banknote,
    TrendingUp,
    PiggyBank,
    Calculator,
    HeartHandshake,
    CheckCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import {
    ContentHubHeader,
    IconGrid,
    ImageWithText,
    TestimonialSlider,
    SupportCTAStrip
} from "@/components/content-hub";

export default function FundingPage() {
    const fundingBasics = [
        {
            icon: Banknote,
            title: "Minimum Allowance",
            description: "The UK government sets a national minimum allowance, typically ranging from £150 to £250 per week per child, depending on age and location.",
        },
        {
            icon: TrendingUp,
            title: "Enhanced Rates",
            description: "Independent agencies often offer higher rates, with some carers receiving between £450 and £650 per week to reflect the professional nature of the role.",
        },
        {
            icon: PiggyBank,
            title: "Tax-Free Status",
            description: "Foster carers benefit from 'Qualifying Care Relief,' meaning a significant portion of your fostering income is completely tax-free.",
        }
    ];

    const testimonials = [
        {
            quote: "I was worried about leaving my job to foster, but the allowance and tax relief meant I could actually afford to do it. It's been the most rewarding decision of my life.",
            author: "Emma Richardson",
            role: "Foster Carer for 4 years",
            initials: "ER"
        },
        {
            quote: "The financial support isn't just about covering costs—it recognizes the professional commitment we make. I feel valued and supported.",
            author: "David Thompson",
            role: "Foster Carer for 6 years",
            initials: "DT"
        }
    ];

    const faqs = [
        {
            question: "Is the fostering allowance considered a salary?",
            answer: "While it functions similarly to an income, it is officially classified as an allowance to cover the costs of caring for a child. However, many agencies include a 'reward' or 'fee' element that recognizes your professional skills."
        },
        {
            question: "Will fostering affect my existing benefits?",
            answer: "In most cases, fostering allowances do not count as income for means-tested benefits like Universal Credit, Housing Benefit, or Council Tax Support. It is always best to check with a specialized advisor."
        },
        {
            question: "Do I get paid between placements?",
            answer: "This varies by agency. Some independent agencies provide 'retainer' payments between placements to ensure your financial stability, while others only pay when a child is in your care."
        },
        {
            question: "Am I self-employed as a foster carer?",
            answer: "Yes, foster carers are classed as self-employed. You will need to register with HMRC, but the specialist tax relief usually means there is little to no tax to pay."
        },
        {
            question: "What expenses does the allowance cover?",
            answer: "The allowance covers all daily costs including food, clothing, school uniforms, activities, pocket money, travel, and personal items for the child."
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Care Funding & Allowances Guide | Foster Care UK"
                description="Learn about foster care funding, including the national minimum allowance, tax-free status, and what the allowance covers. Professional support for foster carers."
                canonicalUrl="https://www.foster-care.co.uk/policy/funding"
                faqData={faqs}
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Funding & Allowances", url: "https://www.foster-care.co.uk/policy/funding" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: Coins,
                        text: "Financial Support & Security"
                    }}
                    title="Fostering"
                    titleHighlight="Allowances"
                    subtitle="Financial support shouldn't be a barrier to making a difference. Learn how allowances provide security for you and the children in your care."
                    ctas={[
                        {
                            text: "Start Your Journey",
                            href: "/become-a-foster"
                        },
                        {
                            text: "Talk to an Expert",
                            href: "/contact",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Funding Basics */}
                <IconGrid
                    title="Understanding Foster Care Funding"
                    subtitle="Transparent, fair, and designed to support both you and the children in your care."
                    items={fundingBasics}
                    columns={3}
                />

                {/* What it Covers */}
                <ImageWithText
                    eyebrow="Transparency"
                    title="What Does the"
                    titleHighlight="Allowance Cover?"
                    description="The allowance is designed to cover all the daily costs of raising a child, ensuring they have everything they need to thrive and succeed. From nutritious meals to school trips, you'll have the resources to provide a full and enriching childhood."
                    bulletPoints={[
                        {
                            icon: CheckCircle,
                            text: "Healthy, balanced meals and nutrition"
                        },
                        {
                            icon: CheckCircle,
                            text: "Clothing, school uniforms, and footwear"
                        },
                        {
                            icon: CheckCircle,
                            text: "Personal items and toiletries"
                        },
                        {
                            icon: CheckCircle,
                            text: "Travel to school and appointments"
                        },
                        {
                            icon: CheckCircle,
                            text: "Extracurricular activities and hobbies"
                        },
                        {
                            icon: CheckCircle,
                            text: "Pocket money and savings for the child"
                        }
                    ]}
                    image={{
                        src: "/images/funding-hero.jpg",
                        alt: "Foster family enjoying a meal",
                        fallback: "https://images.unsplash.com/photo-1491438590914-bc09fbfaf77a?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="right"
                />

                {/* Testimonials */}
                <TestimonialSlider testimonials={testimonials} />

                {/* Breaking the Stigma */}
                <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-10 mx-auto">
                                <HeartHandshake className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 tracking-tight text-slate-950">
                                Fostering with Purpose
                            </h2>
                            <p className="text-lg md:text-2xl text-slate-600 font-medium leading-relaxed mb-10 max-w-3xl mx-auto">
                                We believe that talking about money shouldn't be taboo. Providing the best life for a child requires resources, and we are committed to ensuring our carers are professionally compensated for their vital work.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/policy/support"
                                    className="text-primary font-bold hover:text-primary/80 flex items-center gap-2 transition-colors text-lg"
                                >
                                    Explore the support network available to you →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Block */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <Calculator className="w-4 h-4" />
                                Financial FAQs
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-950 tracking-tight">
                                Money Matters
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                Clear answers to your financial questions about foster care.
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
                    icon={Coins}
                    title="Have Questions About Funding?"
                    description="Our team can provide detailed information about allowances, tax relief, and financial support specific to your situation."
                    ctas={[
                        {
                            text: "Speak to a Financial Advisor",
                            href: "/contact"
                        },
                        {
                            text: "View Training Options",
                            href: "/policy/training",
                            variant: "outline"
                        }
                    ]}
                />
            </main>
        </>
    );
}
