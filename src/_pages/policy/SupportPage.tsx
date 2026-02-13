"use client";

import {
    PhoneCall,
    Heart,
    UserCheck,
    Users,
    ShieldCheck,
    MessageCircle,
    Clock
} from "lucide-react";
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

export default function SupportPage() {
    const supportFeatures = [
        {
            icon: PhoneCall,
            title: "24/7 Helpline",
            description: "Critical support whenever you need it. Our emergency lines are staffed 365 days a year by experienced social workers.",
        },
        {
            icon: UserCheck,
            title: "Dedicated Social Worker",
            description: "You'll have a consistent point of contact who knows your family and the child in your care intimately.",
        },
        {
            icon: Users,
            title: "Peer Support Networks",
            description: "Connect with local foster carers for monthly meetups, support groups, and shared experiences.",
        }
    ];

    const supportSteps = [
        {
            icon: PhoneCall,
            title: "Initial Contact",
            description: "Reach out via phone, email, or our online portal anytime you need assistance."
        },
        {
            icon: UserCheck,
            title: "Assessment",
            description: "Your social worker will assess the situation and determine the best support pathway."
        },
        {
            icon: ShieldCheck,
            title: "Action Plan",
            description: "We'll create a tailored support plan with clear actions and timelines."
        },
        {
            icon: Heart,
            title: "Ongoing Support",
            description: "Regular check-ins and continuous support until the situation is resolved."
        }
    ];

    const testimonials = [
        {
            quote: "The 24/7 hotline has been a lifesaver. Knowing that I can pick up the phone at 3 AM and speak to someone who understands the complexity of foster care gives me incredible peace of mind.",
            author: "Mark Walters",
            role: "Foster Carer for 5 years",
            initials: "MW"
        },
        {
            quote: "My supervising social worker isn't just a professional contact—she's become a trusted friend. The support network here is genuinely caring and responsive.",
            author: "Lisa Anderson",
            role: "Foster Carer for 3 years",
            initials: "LA"
        },
        {
            quote: "The peer support groups have been invaluable. Sharing experiences with other carers who truly understand what you're going through makes all the difference.",
            author: "Raj Kumar",
            role: "Foster Carer for 2 years",
            initials: "RK"
        }
    ];

    const metrics = [
        {
            value: 24,
            suffix: "/7",
            label: "Support Available",
            icon: Clock
        },
        {
            value: 98,
            suffix: "%",
            label: "Response Rate",
            icon: PhoneCall
        },
        {
            value: 500,
            suffix: "+",
            label: "Support Groups",
            icon: Users
        },
        {
            value: 15,
            label: "Avg. Response (mins)",
            icon: MessageCircle
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Carer Support & Resources | Foster Care UK"
                description="Explore the comprehensive support available to foster carers in the UK, including 24/7 helplines, peer networks, and dedicated social workers."
                canonicalUrl="https://www.foster-care.co.uk/policy/support"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Support & Resources", url: "https://www.foster-care.co.uk/policy/support" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: Heart,
                        text: "We're With You Every Step"
                    }}
                    title="Support for"
                    titleHighlight="Foster Carers"
                    subtitle="Fostering is a rewarding journey, but it doesn't have to be a lonely one. Our comprehensive support network ensures you are never without help."
                    ctas={[
                        {
                            text: "Request Support Info",
                            href: "/contact"
                        },
                        {
                            text: "Start Fostering",
                            href: "/become-a-foster",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Support Features */}
                <IconGrid
                    title="Your Support Network"
                    subtitle="From emergency helplines to peer connections, we provide comprehensive support at every stage of your fostering journey."
                    items={supportFeatures}
                    columns={3}
                />

                {/* Support Details */}
                <ImageWithText
                    eyebrow="Holistic Care"
                    title="A Dedicated Support"
                    titleHighlight="System for You"
                    description="We understand that fostering can be challenging, which is why we've built a multi-layered support system. From frequent home visits to crisis intervention, you'll have access to professional support whenever you need it."
                    bulletPoints={[
                        {
                            icon: ShieldCheck,
                            text: "Frequent home visits from your supervising social worker"
                        },
                        {
                            icon: ShieldCheck,
                            text: "Regular local authority review meetings"
                        },
                        {
                            icon: ShieldCheck,
                            text: "Assistance with child health and education plans"
                        },
                        {
                            icon: ShieldCheck,
                            text: "Crisis intervention and behavioral support"
                        },
                        {
                            icon: Heart,
                            text: "Access to specialized counseling and mental health resources"
                        },
                        {
                            icon: Heart,
                            text: "Paid respite breaks to ensure you can recharge"
                        }
                    ]}
                    image={{
                        src: "/images/support-hero.jpg",
                        alt: "Support group meeting",
                        fallback: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="right"
                />

                {/* Metrics */}
                <MetricCounter metrics={metrics} />

                {/* How to Get Support */}
                <ProcessTimeline
                    title="How to Access Support"
                    subtitle="Getting help is simple and straightforward. Here's how our support process works."
                    steps={supportSteps}
                />

                {/* Testimonials */}
                <TestimonialSlider testimonials={testimonials} />

                {/* Support CTA */}
                <SupportCTAStrip
                    icon={PhoneCall}
                    title="Need Support Right Now?"
                    description="Our 24/7 helpline is always available. Whether you're facing a crisis or just need someone to talk to, we're here for you."
                    ctas={[
                        {
                            text: "Call Support Line",
                            href: "/contact"
                        },
                        {
                            text: "View Training Resources",
                            href: "/policy/training",
                            variant: "outline"
                        }
                    ]}
                />
            </main>
        </>
    );
}
