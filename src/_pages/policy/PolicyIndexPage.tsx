"use client";

import {
    Shield,
    Coins,
    GraduationCap,
    Users,
    HeartHandshake,
    FileText,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { ContentHubHeader } from "@/components/content-hub";

export default function PolicyIndexPage() {
    const policies = [
        {
            icon: Shield,
            title: "Safeguarding",
            description: "Our comprehensive approach to protecting children in care, including DBS checks, training, and ongoing monitoring.",
            href: "/policy/safeguarding",
            color: "from-red-50 to-rose-50",
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
        },
        {
            icon: Coins,
            title: "Funding & Allowances",
            description: "Transparent information about foster care funding, tax relief, and what the allowance covers.",
            href: "/policy/funding",
            color: "from-emerald-50 to-green-50",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            icon: GraduationCap,
            title: "Training & Development",
            description: "Ongoing professional development opportunities to help you provide the best care possible.",
            href: "/policy/training",
            color: "from-blue-50 to-indigo-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            icon: Users,
            title: "Placement Process",
            description: "How we carefully match children with foster families to ensure the best outcomes for everyone.",
            href: "/policy/placement",
            color: "from-purple-50 to-violet-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            icon: HeartHandshake,
            title: "Support Network",
            description: "24/7 support, peer networks, and professional guidance available to all foster carers.",
            href: "/policy/support",
            color: "from-amber-50 to-orange-50",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600"
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Care Policies & Guidelines | Foster Care UK"
                description="Explore our comprehensive policies covering safeguarding, funding, training, placement, and support for foster carers across the UK."
                canonicalUrl="https://www.foster-care.co.uk/policy"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "https://www.foster-care.co.uk/policy" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: FileText,
                        text: "Transparency & Standards"
                    }}
                    title="Our"
                    titleHighlight="Policies"
                    subtitle="We believe in complete transparency. Explore our comprehensive policies that guide how we support foster carers and protect children in care."
                    ctas={[
                        {
                            text: "Become a Foster Carer",
                            href: "/become-a-foster"
                        },
                        {
                            text: "Contact Us",
                            href: "/contact",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Policy Grid */}
                <section className="py-20 md:py-28 bg-background">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {policies.map((policy, index) => {
                                const IconComponent = policy.icon;
                                return (
                                    <motion.div
                                        key={policy.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={policy.href}
                                            className="group block h-full"
                                        >
                                            <div className={`h-full rounded-3xl bg-gradient-to-br ${policy.color} p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/50`}>
                                                <div className={`w-16 h-16 rounded-2xl ${policy.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                    <IconComponent className={`w-8 h-8 ${policy.iconColor}`} />
                                                </div>

                                                <h3 className="text-2xl font-black mb-3 text-slate-950 tracking-tight">
                                                    {policy.title}
                                                </h3>

                                                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                                                    {policy.description}
                                                </p>

                                                <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                                                    Learn more
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Additional Resources */}
                <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-slate-950">
                                    Additional Resources
                                </h2>
                                <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                    Explore more information to help you on your fostering journey
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Link
                                    href="/become-a-foster"
                                    className="group block rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/50"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black mb-2 text-slate-950">
                                        How to Become a Foster Carer
                                    </h3>
                                    <p className="text-slate-600 font-medium mb-4">
                                        Learn about eligibility, the application process, and what to expect
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                                        Get started
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>

                                <Link
                                    href="/editorial-policy"
                                    className="group block rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/50"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black mb-2 text-slate-950">
                                        Editorial Policy
                                    </h3>
                                    <p className="text-slate-600 font-medium mb-4">
                                        Our commitment to accuracy, transparency, and child welfare
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                                        Read more
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
