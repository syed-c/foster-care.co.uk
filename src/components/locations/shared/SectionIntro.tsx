"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface SectionIntroProps {
    eyebrow?: string;
    eyebrowIcon?: LucideIcon;
    heading: ReactNode;
    subheading?: ReactNode;
    microCopy?: string;
    align?: "left" | "center";
    center?: boolean; // Convenience prop
    inverted?: boolean; // For dark backgrounds
    className?: string;
    headingClassName?: string;
    gradientText?: boolean;
}

export function SectionIntro({
    eyebrow,
    eyebrowIcon: EyebrowIcon,
    heading,
    subheading,
    microCopy,
    align = "left",
    center,
    inverted = false,
    className,
    headingClassName,
    gradientText = false
}: SectionIntroProps) {
    const isCenter = align === "center" || center;

    return (
        <ScrollReveal effect="slideUp" className={cn("mb-12 md:mb-16", className)}>
            <div className={cn(isCenter && "text-center max-w-3xl mx-auto")}>
                {/* Eyebrow Text */}
                {eyebrow && (
                    <div className={cn(
                        "inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-4 md:mb-6",
                        inverted ? "text-primary/90" : "text-primary",
                        isCenter && "justify-center"
                    )}>
                        {EyebrowIcon && <EyebrowIcon className="w-4 h-4" />}
                        <div className={cn("w-10 h-px", inverted ? "bg-primary/50" : "bg-primary")} />
                        {eyebrow}
                    </div>
                )}

                {/* Micro Copy */}
                {microCopy && (
                    <p className={cn(
                        "text-sm md:text-base font-medium mb-3 italic",
                        inverted ? "text-primary/70" : "text-primary/80",
                        isCenter && "text-center"
                    )}>
                        {microCopy}
                    </p>
                )}

                {/* Main Heading */}
                <h2 className={cn(
                    "text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-[1.2]",
                    gradientText && !inverted && "text-slate-900",
                    !gradientText && !inverted && "text-slate-900",
                    inverted && "text-white",
                    headingClassName
                )}>
                    {heading}
                </h2>

                {/* Subheading */}
                {subheading && (
                    <div className={cn(
                        "text-base md:text-lg font-medium leading-relaxed max-w-2xl",
                        inverted ? "text-slate-300" : "text-slate-600",
                        isCenter && "mx-auto"
                    )}>
                        {subheading}
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
}
