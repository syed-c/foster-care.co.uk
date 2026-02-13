"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricItem {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    icon?: LucideIcon;
}

interface MetricCounterProps {
    metrics: MetricItem[];
    duration?: number;
    className?: string;
}

export function MetricCounter({
    metrics,
    duration = 2000,
    className = ""
}: MetricCounterProps) {
    return (
        <section className={`py-16 md:py-24 bg-primary/5 ${className}`}>
            <div className="container-main px-4">
                <div className={`grid grid-cols-2 ${metrics.length > 2 ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-8 md:gap-12 max-w-5xl mx-auto`}>
                    {metrics.map((metric, index) => (
                        <CounterItem
                            key={index}
                            metric={metric}
                            duration={duration}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CounterItem({
    metric,
    duration,
    delay
}: {
    metric: MetricItem;
    duration: number;
    delay: number;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const Icon = metric.icon;

    useEffect(() => {
        if (!isInView) return;

        const startTime = Date.now() + delay;
        const endValue = metric.value;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;

            if (elapsed < 0) {
                requestAnimationFrame(animate);
                return;
            }

            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * endValue);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, metric.value, duration, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: delay / 1000 }}
            className="text-center p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
        >
            {Icon && (
                <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
            )}
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-3 tracking-tight">
                {metric.prefix}
                {count.toLocaleString()}
                {metric.suffix}
            </div>
            <div className="text-sm md:text-base lg:text-lg text-slate-600 font-bold uppercase tracking-wide">
                {metric.label}
            </div>
        </motion.div>
    );
}
