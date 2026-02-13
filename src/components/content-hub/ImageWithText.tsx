"use client";

import { motion } from "framer-motion";
import { LucideIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ImageWithTextProps {
    eyebrow?: string;
    title: string;
    titleHighlight?: string;
    description: string;
    bulletPoints?: Array<{
        icon?: LucideIcon;
        text: string;
    }>;
    image: {
        src: string;
        alt: string;
        fallback?: string;
    };
    imagePosition?: "left" | "right";
    cta?: {
        text: string;
        href: string;
    };
    className?: string;
}

export function ImageWithText({
    eyebrow,
    title,
    titleHighlight,
    description,
    bulletPoints = [],
    image,
    imagePosition = "right",
    cta,
    className = ""
}: ImageWithTextProps) {
    return (
        <section className={`py-16 md:py-24 bg-white overflow-hidden ${className}`}>
            <div className="container-main px-4">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${imagePosition === "left" ? "lg:flex-row-reverse" : ""
                    }`}>
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: imagePosition === "left" ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={imagePosition === "left" ? "lg:order-2" : ""}
                    >
                        {eyebrow && (
                            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-6">
                                <div className="w-10 h-px bg-primary" />
                                {eyebrow}
                            </div>
                        )}

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 tracking-tight text-slate-950 leading-[1.1]">
                            {title}
                            {titleHighlight && (
                                <>
                                    {" "}
                                    <span className="text-primary italic">{titleHighlight}</span>
                                </>
                            )}
                        </h2>

                        <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 font-medium leading-relaxed">
                            {description}
                        </p>

                        {bulletPoints.length > 0 && (
                            <div className="space-y-4 mb-8 md:mb-10">
                                {bulletPoints.map((point, index) => {
                                    const Icon = point.icon || CheckCircle;
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-700 font-medium leading-relaxed">
                                                {point.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {cta && (
                            <Button
                                size="lg"
                                className="rounded-full h-14 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                asChild
                            >
                                <Link href={cta.href}>{cta.text}</Link>
                            </Button>
                        )}
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: imagePosition === "left" ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={`relative ${imagePosition === "left" ? "lg:order-1" : ""}`}
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    if (image.fallback) {
                                        (e.target as HTMLImageElement).src = image.fallback;
                                    }
                                }}
                            />
                        </div>
                        {/* Decorative blur elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-50 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
