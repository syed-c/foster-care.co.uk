"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CarouselSectionProps {
    children: ReactNode[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showControls?: boolean;
    showDots?: boolean;
    className?: string;
    itemClassName?: string;
    mobileOnly?: boolean;
}

export function CarouselSection({
    children,
    autoPlay = false,
    autoPlayInterval = 5000,
    showControls = true,
    showDots = true,
    className,
    itemClassName,
    mobileOnly = false
}: CarouselSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    const itemCount = children.length;

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isPaused || itemCount <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % itemCount);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, isPaused, itemCount, autoPlayInterval]);

    // Animate to current index
    useEffect(() => {
        if (!constraintsRef.current) return;
        const itemWidth = constraintsRef.current.offsetWidth;
        animate(x, -currentIndex * itemWidth, {
            type: "spring",
            stiffness: 300,
            damping: 30
        });
    }, [currentIndex, x]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % itemCount);
    };

    if (itemCount === 0) return null;

    return (
        <div
            className={cn("relative", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={constraintsRef}>
                <motion.div
                    className={cn(
                        "flex",
                        mobileOnly && "md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
                    )}
                    style={{ x }}
                    drag={!mobileOnly ? "x" : undefined}
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                        const threshold = 50;
                        if (info.offset.x > threshold && currentIndex > 0) {
                            goToPrevious();
                        } else if (info.offset.x < -threshold && currentIndex < itemCount - 1) {
                            goToNext();
                        }
                    }}
                >
                    {children.map((child, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex-shrink-0 w-full px-2",
                                mobileOnly && "md:flex-shrink md:w-auto md:px-0",
                                itemClassName
                            )}
                        >
                            {child}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Controls */}
            {showControls && itemCount > 1 && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPrevious}
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                            "w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-slate-200",
                            "shadow-lg hover:bg-white hover:scale-110 transition-all",
                            mobileOnly && "md:hidden"
                        )}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNext}
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                            "w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-slate-200",
                            "shadow-lg hover:bg-white hover:scale-110 transition-all",
                            mobileOnly && "md:hidden"
                        )}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && itemCount > 1 && (
                <div className={cn(
                    "flex items-center justify-center gap-2 mt-8",
                    mobileOnly && "md:hidden"
                )}>
                    {Array.from({ length: itemCount }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "bg-primary w-8"
                                    : "bg-slate-300 hover:bg-slate-400"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
