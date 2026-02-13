"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SupportCTAStripProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    ctas: Array<{
        text: string;
        href: string;
        variant?: "default" | "outline";
    }>;
    backgroundColor?: string;
    className?: string;
}

export function SupportCTAStrip({
    title,
    description,
    icon,
    ctas,
    backgroundColor = "bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50",
    className = ""
}: SupportCTAStripProps) {
    const Icon = icon;

    return (
        <section className={`py-16 md:py-20 ${backgroundColor} ${className}`}>
            <div className="container-main px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {Icon && (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 md:mb-8">
                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        </div>
                    )}

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6 text-slate-950 tracking-tight">
                        {title}
                    </h2>

                    <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {ctas.map((cta, index) => (
                            <Button
                                key={index}
                                size="lg"
                                variant={cta.variant || "default"}
                                className={`w-full sm:w-auto rounded-full h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold group ${cta.variant === "outline"
                                        ? "border-slate-300 text-slate-700 hover:bg-white"
                                        : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                    }`}
                                asChild
                            >
                                <Link href={cta.href}>
                                    {cta.text}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
