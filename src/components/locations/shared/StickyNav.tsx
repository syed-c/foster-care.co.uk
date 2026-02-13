"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StickyNavProps {
    sections: {
        id: string;
        label: string;
    }[];
    className?: string;
    offset?: number;
}

export function StickyNav({ sections, className, offset = 100 }: StickyNavProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Show nav after scrolling past offset
            setIsVisible(window.scrollY > offset);

            // Calculate page progress
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setProgress(scrollProgress);

            // Determine active section
            const sectionElements = sections.map(section => ({
                id: section.id,
                element: document.getElementById(section.id)
            }));

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                if (section.element) {
                    const rect = section.element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections, offset]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const top = element.offsetTop - 80;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 shadow-sm",
                        className
                    )}
                >
                    {/* Progress Bar */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60"
                        style={{ width: `${progress}%` }}
                    />

                    <div className="container-main px-4">
                        <div className="flex items-center justify-between py-3">
                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                                            activeSection === section.id
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Dropdown */}
                            <div className="md:hidden flex-1">
                                <select
                                    value={activeSection}
                                    onChange={(e) => scrollToSection(e.target.value)}
                                    className="w-full px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="/become-a-foster"
                                className="ml-4 px-6 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                Start Journey
                            </Link>
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
