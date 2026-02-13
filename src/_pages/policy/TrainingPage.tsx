"use client";

import {
    GraduationCap,
    BookOpen,
    Award,
    BadgeCheck,
    CheckCircle,
    Video,
    Download,
    Sparkles,
    Clock,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function TrainingPage() {
    const trainingFeatures = [
        {
            icon: BookOpen,
            title: "Pre-Approval Training",
            description: "The 'Skills to Foster' course prepares you for the initial challenges and rewards of fostering before you are approved.",
        },
        {
            icon: Sparkles,
            title: "Ongoing Development",
            description: "Continuous professional development through workshops, webinars, and specialist therapeutic training modules.",
        },
        {
            icon: Award,
            title: "Accredited Courses",
            description: "Gain recognized qualifications in child care and development as you progress through your fostering career.",
        }
    ];

    const trainingSteps = [
        {
            icon: BookOpen,
            title: "Skills to Foster",
            description: "Foundation course covering fostering basics, child development, safeguarding, and working with families."
        },
        {
            icon: BadgeCheck,
            title: "Post-Approval (Year 1)",
            description: "TSD standards, behavior management, first aid, and professional record keeping."
        },
        {
            icon: Award,
            title: "Specialist Training",
            description: "Therapeutic care, trauma-informed practice, disabilities support, and teen independence prep."
        },
        {
            icon: GraduationCap,
            title: "Advanced Qualifications",
            description: "Pursue recognized certifications and advanced diplomas in child care and development."
        }
    ];

    const testimonials = [
        {
            quote: "The training gave me confidence I didn't know I needed. From understanding trauma to managing challenging behaviors, I felt prepared for every situation.",
            author: "Sophie Williams",
            role: "Foster Carer for 3 years",
            initials: "SW"
        },
        {
            quote: "The ongoing workshops keep me sharp and connected to the latest research. It's not just training—it's a community of learning.",
            author: "Ahmed Hassan",
            role: "Foster Carer for 5 years",
            initials: "AH"
        }
    ];

    const metrics = [
        {
            value: 40,
            suffix: "+",
            label: "Training Hours",
            icon: Clock
        },
        {
            value: 95,
            suffix: "%",
            label: "Completion Rate",
            icon: BadgeCheck
        },
        {
            value: 200,
            suffix: "+",
            label: "Course Modules",
            icon: BookOpen
        },
        {
            value: 50,
            suffix: "+",
            label: "Expert Trainers",
            icon: Users
        }
    ];

    return (
        <>
            <SEOHead
                title="Foster Carer Training & Professional Development | Foster Care UK"
                description="Explore our comprehensive training programs for foster carers, from pre-approval 'Skills to Foster' courses to ongoing therapeutic training."
                canonicalUrl="https://www.foster-care.co.uk/policy/training"
                structuredData={getBreadcrumbSchema([
                    { name: "Home", url: "https://www.foster-care.co.uk" },
                    { name: "Policies", url: "#" },
                    { name: "Training & Development", url: "https://www.foster-care.co.uk/policy/training" },
                ])}
            />

            <main className="flex-1">
                {/* Header */}
                <ContentHubHeader
                    badge={{
                        icon: GraduationCap,
                        text: "Empowering Your Success"
                    }}
                    title="Fostering"
                    titleHighlight="Training"
                    subtitle="You are never alone in your learning. From day one, we provide the tools, knowledge, and support to help you become an expert carer."
                    ctas={[
                        {
                            text: "Start Training",
                            href: "/become-a-foster"
                        },
                        {
                            text: "View Curriculum",
                            href: "#curriculum",
                            variant: "outline"
                        }
                    ]}
                />

                {/* Training Features */}
                <IconGrid
                    title="Your Learning Journey"
                    subtitle="From foundational skills to advanced qualifications, we support your development every step of the way."
                    items={trainingFeatures}
                    columns={3}
                />

                {/* Training Details */}
                <ImageWithText
                    eyebrow="Your Growth"
                    title="A Journey of"
                    titleHighlight="Continuous Learning"
                    description="Our training pathway is designed to support you at every stage, from your very first enquiry to caring for children with complex needs. We combine online learning, in-person workshops, and peer support to create a comprehensive development experience."
                    bulletPoints={[
                        {
                            icon: CheckCircle,
                            text: "Interactive online modules you can complete at your own pace"
                        },
                        {
                            icon: CheckCircle,
                            text: "In-person workshops with experienced trainers"
                        },
                        {
                            icon: CheckCircle,
                            text: "Peer learning groups and mentorship opportunities"
                        },
                        {
                            icon: CheckCircle,
                            text: "Specialist courses in trauma, disabilities, and therapeutic care"
                        },
                        {
                            icon: CheckCircle,
                            text: "First aid and safeguarding certifications"
                        },
                        {
                            icon: CheckCircle,
                            text: "Ongoing CPD to maintain and enhance your skills"
                        }
                    ]}
                    image={{
                        src: "/images/training-hero.jpg",
                        alt: "Carer attending a workshop",
                        fallback: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"
                    }}
                    imagePosition="right"
                />

                {/* Metrics */}
                <MetricCounter metrics={metrics} />

                {/* Training Timeline */}
                <ProcessTimeline
                    title="Your Training Pathway"
                    subtitle="From beginner to expert, here's how our structured training program develops your skills."
                    steps={trainingSteps}
                />

                {/* Testimonials */}
                <TestimonialSlider testimonials={testimonials} />

                {/* Digital Resources */}
                <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                            {/* Digital Workshop Hub */}
                            <div className="p-10 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-lg text-center">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 mx-auto">
                                    <Video className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-950">
                                    Digital Workshop Hub
                                </h3>
                                <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                                    Access our library of recorded webinars, specialist guest lectures, and bite-sized training videos anytime, anywhere.
                                </p>
                                <Button className="rounded-full h-14 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                                    Access Training Portal
                                </Button>
                            </div>

                            {/* Training Prospectus */}
                            <div className="p-10 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-lg text-center">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 mx-auto">
                                    <Download className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-950">
                                    Training Prospectus
                                </h3>
                                <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                                    Download our full 2026 training guide to see the complete list of mandatory and optional courses.
                                </p>
                                <Button variant="outline" className="rounded-full h-14 px-8 border-slate-300 text-slate-700 font-bold hover:bg-slate-50">
                                    Download PDF Guide
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support CTA */}
                <SupportCTAStrip
                    icon={GraduationCap}
                    title="Ready to Begin Your Training?"
                    description="Our training team can answer your questions about course content, schedules, and how to get started on your learning journey."
                    ctas={[
                        {
                            text: "Speak to Training Team",
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
