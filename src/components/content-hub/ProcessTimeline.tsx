"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
    icon?: LucideIcon;
    title: string;
    description: string;
}

interface ProcessTimelineProps {
    title?: string;
    subtitle?: string;
    steps: ProcessStep[];
    className?: string;
}

export function ProcessTimeline({
    title,
    subtitle,
    steps,
    className = ""
}: ProcessTimelineProps) {
    return (
        <section className={`py-16 md:py-24 bg-background-sand ${className}`}>
            <div className="container-main px-4">
                {(title || subtitle) && (
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-950 tracking-tight"
                            >
                                {title}
                            </motion.h2>
                        )}
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                )}

                <div className="max-w-5xl mx-auto">
                    {/* Desktop: Horizontal Timeline */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Connection Line */}
                            <div className="absolute top-12 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute top-12 left-0 h-1 bg-primary rounded-full"
                            />

                            <div className="grid grid-cols-4 gap-8">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.2 }}
                                            className="relative"
                                        >
                                            {/* Step Number/Icon */}
                                            <div className="relative z-10 w-24 h-24 mx-auto rounded-2xl bg-white border-4 border-primary shadow-lg flex items-center justify-center mb-6">
                                                {Icon ? (
                                                    <Icon className="w-10 h-10 text-primary" />
                                                ) : (
                                                    <span className="text-3xl font-black text-primary">
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="text-center">
                                                <h3 className="text-lg font-black text-slate-950 mb-3 leading-tight">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Vertical Timeline */}
                    <div className="md:hidden space-y-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                                        {Icon ? (
                                            <Icon className="w-8 h-8 text-white" />
                                        ) : (
                                            <span className="text-2xl font-black text-white">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-950 mb-2 leading-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 font-medium leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
