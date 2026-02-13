"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ContentHubHeaderProps {
    badge?: {
        icon?: LucideIcon;
        text: string;
    };
    title: string;
    titleHighlight?: string;
    subtitle: string;
    ctas?: Array<{
        text: string;
        href: string;
        variant?: "default" | "outline";
    }>;
    backgroundImage?: string;
    backgroundGradient?: string;
}

export function ContentHubHeader({
    badge,
    title,
    titleHighlight,
    subtitle,
    ctas = [],
    backgroundImage,
    backgroundGradient = "from-emerald-50/50 via-white to-slate-50/30"
}: ContentHubHeaderProps) {
    const BadgeIcon = badge?.icon;

    return (
        <section className={`relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br ${backgroundGradient}`}>
            {/* Background Pattern/Image */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0 opacity-5">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />

            <div className="container-main relative z-10 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {badge && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 md:mb-8 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-[10px] md:text-[11px]">
                                {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 mr-2 inline" />}
                                {badge.text}
                            </Badge>
                        )}

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-[1.05] text-slate-950">
                            {title}
                            {titleHighlight && (
                                <>
                                    {" "}
                                    <span className="text-primary italic">{titleHighlight}</span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            {subtitle}
                        </p>

                        {ctas.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {ctas.map((cta, index) => (
                                    <Button
                                        key={index}
                                        size="lg"
                                        variant={cta.variant || "default"}
                                        className={`w-full sm:w-auto rounded-full h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold ${cta.variant === "outline"
                                                ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                                                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                            }`}
                                        asChild
                                    >
                                        <Link href={cta.href}>{cta.text}</Link>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
