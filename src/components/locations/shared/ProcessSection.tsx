"use client";

import { motion } from "framer-motion";
import { MessageCircle, Home, GraduationCap, Heart, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePageBlocks, getBlock, ContentBlock } from "@/hooks/usePageBlocks";
import { DynamicContent } from "@/components/shared/DynamicContent";

interface ProcessSectionProps {
    locationName: string;
    className?: string;
    inverted?: boolean;
    blocks?: ContentBlock[];
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
        title: "Panel",
        desc: "Approval decision",
        timeline: "4-6 months",
        detail: "Your fostering panel reviews your assessment, confirms approval, and gets you ready for your first placement."
    }
];

export function ProcessSection({ locationName, className, inverted = false, blocks }: ProcessSectionProps) {
    return (
        <div className={cn("py-24 overflow-hidden", inverted ? "bg-transparent" : "bg-background-sand", className)}>
            <div className="container-main px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
                    <div className="max-w-2xl mx-auto md:mx-0">
                        <h2 className={cn("text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight", inverted ? "text-white" : "text-slate-950")}>
                            <DynamicContent
                                block={getBlock(blocks, "process_title")}
                                fallback={<>Your Journey to <span className="text-primary italic">Fostering</span> in {locationName}</>}
                            />
                        </h2>
                        <p className={cn("text-lg font-medium", inverted ? "text-slate-400" : "text-slate-600")}>
                            <DynamicContent
                                block={getBlock(blocks, "process_subtitle")}
                                fallback="We've simplified the process into four clear steps, supporting you at every stage of your application."
                            />
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className={cn("hidden md:block absolute top-12 left-[10%] right-[10%] h-px z-0", inverted ? "bg-white/10" : "bg-slate-200")} />

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
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border shadow-xl",
                                    inverted
                                        ? "bg-white/5 border-white/10 shadow-black/20"
                                        : "bg-white border-slate-50 shadow-slate-200/50"
                                )}>
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>

                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                        <span className={cn("text-4xl font-black select-none", inverted ? "text-primary/20" : "text-primary/10")}>0{i + 1}</span>
                                        <h3 className={cn("text-2xl font-bold", inverted ? "text-white" : "text-slate-950")}>{step.title}</h3>
                                    </div>
                                    <p className="text-sm font-black text-primary uppercase tracking-widest mb-1">{step.desc}</p>
                                    <div className={cn("text-[10px] font-bold uppercase tracking-tighter mb-4 flex items-center gap-1", inverted ? "text-slate-500" : "text-slate-400")}>
                                        <Clock className="w-3 h-3" />
                                        Timeline: {step.timeline}
                                    </div>
                                    <p className={cn("leading-relaxed font-medium mb-6", inverted ? "text-slate-400" : "text-slate-500")}>
                                        {step.detail.replace("In Location", `In ${locationName}`)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center md:text-left">
                    <div className={cn(
                        "inline-flex items-center gap-2 p-1.5 pr-6 rounded-full shadow-sm border group",
                        inverted ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
                    )}>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <span className={cn("text-sm font-bold", inverted ? "text-slate-300" : "text-slate-600")}>
                            Agencies in {locationName} are currently active and recruiting
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
