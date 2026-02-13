"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwipeableCardsProps {
    children: ReactNode[];
    className?: string;
    itemClassName?: string;
    showScrollbar?: boolean;
}

export function SwipeableCards({
    children,
    className,
    itemClassName,
    showScrollbar = false
}: SwipeableCardsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: scrollRef });

    // Transform scroll progress to gradient fade
    const leftFade = useTransform(scrollXProgress, [0, 0.05], [0, 1]);
    const rightFade = useTransform(scrollXProgress, [0.95, 1], [1, 0]);

    return (
        <div className={cn("relative", className)}>
            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className={cn(
                    "flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4",
                    "md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none",
                    !showScrollbar && "scrollbar-hide"
                )}
                style={{
                    scrollbarWidth: showScrollbar ? "thin" : "none",
                    msOverflowStyle: showScrollbar ? "auto" : "none"
                }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex-shrink-0 w-[85vw] sm:w-[400px] snap-center",
                            "md:w-auto md:flex-shrink md:snap-align-none",
                            itemClassName
                        )}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Left Gradient Fade (Mobile Only) */}
            <motion.div
                style={{ opacity: leftFade }}
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10",
                    "bg-gradient-to-r from-white to-transparent",
                    "md:hidden"
                )}
            />

            {/* Right Gradient Fade (Mobile Only) */}
            <motion.div
                style={{ opacity: rightFade }}
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10",
                    "bg-gradient-to-l from-white to-transparent",
                    "md:hidden"
                )}
            />

            {/* Scroll Indicator (Mobile Only) */}
            <div className="flex justify-center gap-1 mt-4 md:hidden">
                {children.map((_, index) => (
                    <motion.div
                        key={index}
                        className="w-1.5 h-1.5 rounded-full bg-slate-300"
                        style={{
                            opacity: useTransform(
                                scrollXProgress,
                                [
                                    (index - 0.5) / children.length,
                                    index / children.length,
                                    (index + 0.5) / children.length
                                ],
                                [0.3, 1, 0.3]
                            )
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
