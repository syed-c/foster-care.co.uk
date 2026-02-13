"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    initials?: string;
}

interface TestimonialSliderProps {
    testimonials: Testimonial[];
    autoRotate?: boolean;
    rotateInterval?: number;
    className?: string;
}

export function TestimonialSlider({
    testimonials,
    autoRotate = true,
    rotateInterval = 6000,
    className = ""
}: TestimonialSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoRotate || isPaused || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, rotateInterval);

        return () => clearInterval(interval);
    }, [autoRotate, isPaused, testimonials.length, rotateInterval]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (testimonials.length === 0) return null;

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section
            className={`py-16 md:py-24 bg-white ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container-main px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-xl">
                        {/* Quote Icon */}
                        <Quote className="w-12 h-12 md:w-16 md:h-16 text-primary/20 mb-8" />

                        {/* Testimonial Content */}
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium italic leading-relaxed text-slate-800 mb-8 md:mb-10">
                                "{currentTestimonial.quote}"
                            </blockquote>

                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                                    {currentTestimonial.avatar ? (
                                        <img
                                            src={currentTestimonial.avatar}
                                            alt={currentTestimonial.author}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg md:text-xl font-black text-primary">
                                            {currentTestimonial.initials || currentTestimonial.author.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Author Info */}
                                <div>
                                    <div className="font-black text-slate-950 text-lg md:text-xl">
                                        {currentTestimonial.author}
                                    </div>
                                    <div className="text-slate-500 text-sm md:text-base font-medium italic">
                                        {currentTestimonial.role}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation */}
                        {testimonials.length > 1 && (
                            <div className="flex items-center justify-between mt-10 md:mt-12 pt-8 border-t border-slate-200">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToPrevious}
                                        className="rounded-full w-12 h-12 border-slate-200 hover:bg-slate-50"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToNext}
                                        className="rounded-full w-12 h-12 border-slate-200 hover:bg-slate-50"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                                    ? "bg-primary w-8"
                                                    : "bg-slate-300 hover:bg-slate-400"
                                                }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
