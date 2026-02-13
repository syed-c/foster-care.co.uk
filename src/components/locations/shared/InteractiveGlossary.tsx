"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface GlossaryTerm {
    term: string;
    definition: string;
    href?: string;
    icon: LucideIcon;
    category?: string;
}

interface InteractiveGlossaryProps {
    terms: GlossaryTerm[];
    className?: string;
}

export function InteractiveGlossary({ terms, className }: InteractiveGlossaryProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <dl className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7", className)}>
            {terms.map((item, index) => {
                const isLink = !!item.href;
                const Component = isLink ? Link : "div";

                return (
                    <motion.div
                        key={item.term}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        className="group relative"
                    >
                        {/* @ts-ignore - Dynamic component type */}
                        <Component
                            {...(isLink ? { href: item.href as string } : {})}
                            className={cn(
                                "block h-full rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60",
                                "px-6 py-7 md:px-8 md:py-9 shadow-sm",
                                isLink ? "hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer" : "",
                                "transition-all duration-300",
                                "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                            )}
                        >
                            {/* Header with Icon and Badge */}
                            <div className="flex items-start gap-3 mb-4">
                                {/* Icon */}
                                <motion.div
                                    animate={{
                                        scale: hoveredIndex === index ? 1.1 : 1,
                                        rotate: hoveredIndex === index ? 5 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="w-9 h-9 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0"
                                >
                                    <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                                </motion.div>

                                {/* Term Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        Term
                                    </span>
                                </div>
                            </div>

                            {/* Term Name */}
                            <dt className={cn(
                                "font-black text-slate-950 text-base md:text-lg mb-2 transition-colors",
                                isLink ? "group-hover:text-primary" : ""
                            )}>
                                {item.term}
                            </dt>

                            {/* Category */}
                            {item.category && (
                                <p className="text-xs text-primary/60 font-bold uppercase tracking-wider mb-3">
                                    {item.category}
                                </p>
                            )}

                            {/* Definition */}
                            <dd className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                                {item.definition}
                            </dd>

                            {/* Learn More Link (Only if href exists) */}
                            {isLink && (
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-primary group-hover:gap-2 transition-all">
                                        <span>Learn more</span>
                                        <ChevronRight className="w-3 h-3" aria-hidden="true" />
                                    </span>
                                </div>
                            )}

                            {/* Hover Gradient Overlay */}
                            <AnimatePresence>
                                {isLink && hoveredIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>
                        </Component>
                    </motion.div>
                );
            })}
        </dl>
    );
}
