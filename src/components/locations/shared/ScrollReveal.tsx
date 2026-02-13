"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export type RevealEffect = "fade" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "none";

interface ScrollRevealProps {
    children: ReactNode;
    effect?: RevealEffect;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    staggerChildren?: boolean;
    staggerDelay?: number;
}

const effectVariants = {
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    },
    slideUp: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 }
    },
    slideRight: {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 }
    },
    scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    },
    none: {
        hidden: {},
        visible: {}
    }
};

export function ScrollReveal({
    children,
    effect = "slideUp",
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
    className,
    staggerChildren = false,
    staggerDelay = 0.1
}: ScrollRevealProps) {
    const shouldReduceMotion = useReducedMotion();
    const variants = shouldReduceMotion ? effectVariants.none : effectVariants[effect];

    const containerVariants = staggerChildren ? {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay
            }
        }
    } : variants;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: threshold }}
            variants={staggerChildren ? containerVariants : variants}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Child component for stagger animations
export function ScrollRevealItem({ children, className }: { children: ReactNode; className?: string }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            variants={shouldReduceMotion ? effectVariants.none : effectVariants.slideUp}
            className={className}
        >
            {children}
        </motion.div>
    );
}
