"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InteractiveCardProps {
    children: ReactNode;
    className?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    badge?: string;
    badgeClassName?: string;
    href?: string;
    onClick?: () => void;
    hoverLift?: boolean;
    gradientReveal?: boolean;
    glowEffect?: boolean;
}

export function InteractiveCard({
    children,
    className,
    icon: Icon,
    iconClassName,
    badge,
    badgeClassName,
    href,
    onClick,
    hoverLift = true,
    gradientReveal = true,
    glowEffect = false
}: InteractiveCardProps) {
    const Component = href ? motion.a : motion.div;
    const componentProps = href ? { href } : {};

    return (
        <Component
            {...componentProps}
            onClick={onClick}
            whileHover={hoverLift ? { y: -4, scale: 1.01 } : {}}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60",
                "shadow-sm hover:shadow-lg hover:shadow-slate-200/30 transition-shadow duration-500",
                href && "cursor-pointer",
                className
            )}
        >
            {/* Gradient Reveal on Hover */}
            {gradientReveal && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            {/* Glow Effect */}
            {glowEffect && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10" />
            )}

            {/* Content Container */}
            <div className="relative z-10 p-6">
                {/* Header with Icon and Badge */}
                {(Icon || badge) && (
                    <div className="flex items-start justify-between mb-4">
                        {Icon && (
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center",
                                    iconClassName
                                )}
                            >
                                <Icon className="w-6 h-6 text-primary" />
                            </motion.div>
                        )}
                        {badge && (
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                "bg-primary/10 text-primary border border-primary/20",
                                badgeClassName
                            )}>
                                {badge}
                            </span>
                        )}
                    </div>
                )}

                {/* Card Content */}
                {children}
            </div>
        </Component>
    );
}
