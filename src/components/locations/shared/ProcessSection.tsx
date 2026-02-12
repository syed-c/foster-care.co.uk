"use client";

import { motion } from "framer-motion";
import { MessageCircle, Home, GraduationCap, Heart, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessSectionProps {
    locationName: string;
    className?: string;
}

const steps = [
    {
        icon: MessageCircle,
        title: "Chat",
        desc: "Initial Contact",
        timeline: "15 min call",
        detail: "A friendly, no-obligation chat to answer your initial questions and understand your situation."
    },
    {
        icon: Home,
        title: "Visit",
        desc: "Home consultation",
        timeline: "1-2 hours",
        detail: "We'll visit your home to discuss fostering in more detail and help you understand the requirements."
    },
    {
        icon: GraduationCap,
        title: "Train",
        desc: "Skills to Foster",
        timeline: "3-4 days",
        detail: "Comprehensive training workshops to prepare you for the rewards and challenges of fostering."
    },
    {
        icon: Heart,
        title: "Foster",
        desc: "First placement",
        timeline: "4-6 months",
        detail: "Begin your journey as an approved foster carer and transform a local child's life."
    }
];

export function ProcessSection({ locationName, className }: ProcessSectionProps) {
    return (
        <section className={cn("py-24 bg-background-sand overflow-hidden", className)}>
            <div className="container-main px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
                    <div className="max-w-2xl mx-auto md:mx-0">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter mb-4 leading-tight">
                            Your Journey to <span className="text-primary italic">Fostering</span> in {locationName}
                        </h2>
                        <p className="text-lg text-slate-600 font-medium">
                            We've simplified the process into four clear steps, supporting you at every stage of your application.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-slate-200 z-0" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative z-10 group"
                        >
                            <div className="flex flex-col items-center md:items-start">
                                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>

                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                        <span className="text-4xl font-black text-primary/10 select-none">0{i + 1}</span>
                                        <h3 className="text-2xl font-bold text-slate-950">{step.title}</h3>
                                    </div>
                                    <p className="text-sm font-black text-primary uppercase tracking-widest mb-1">{step.desc}</p>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Timeline: {step.timeline}
                                    </div>
                                    <p className="text-slate-500 leading-relaxed font-medium mb-6">
                                        {step.detail.replace("In Location", `In ${locationName}`)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 p-1.5 pr-6 bg-white rounded-full shadow-sm border border-slate-100 group">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                            Agencies in {locationName} are currently active and recruiting
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
