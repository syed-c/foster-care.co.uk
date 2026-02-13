"use client";

import { motion } from "framer-motion";
import { LucideIcon, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface IntroSectionProps {
    title?: string;
    description: string;
    bulletPoints?: Array<{
        icon?: LucideIcon;
        text: string;
    }>;
    stats?: Array<{
        value: string;
        label: string;
        icon?: LucideIcon;
    }>;
    className?: string;
}

export function IntroSection({
    title,
    description,
    bulletPoints = [],
    stats = [],
    className = ""
}: IntroSectionProps) {
    return (
        <section className={`py-16 md:py-24 bg-white ${className}`}>
            <div className="container-main px-4">
                <div className="max-w-4xl mx-auto">
                    {title && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 text-slate-950 tracking-tight text-center"
                        >
                            {title}
                        </motion.h2>
                    )}

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 md:mb-12 font-medium text-center"
                    >
                        {description}
                    </motion.p>

                    {bulletPoints.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="grid sm:grid-cols-2 gap-4 mb-12"
                        >
                            {bulletPoints.map((point, index) => {
                                const Icon = point.icon || CheckCircle;
                                return (
                                    <Card
                                        key={index}
                                        className="p-5 md:p-6 rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-700 font-medium leading-relaxed">
                                                {point.text}
                                            </span>
                                        </div>
                                    </Card>
                                );
                            })}
                        </motion.div>
                    )}

                    {stats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                        >
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
                                    >
                                        {Icon && (
                                            <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                                        )}
                                        <div className="text-3xl md:text-4xl font-black text-slate-950 mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm md:text-base text-slate-600 font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
