"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconGridItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface IconGridProps {
    title?: string;
    subtitle?: string;
    items: IconGridItem[];
    columns?: 2 | 3 | 4;
    className?: string;
}

export function IconGrid({
    title,
    subtitle,
    items,
    columns = 3,
    className = ""
}: IconGridProps) {
    const gridCols = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4"
    };

    return (
        <section className={`py-16 md:py-24 bg-background-sand ${className}`}>
            <div className="container-main px-4">
                {(title || subtitle) && (
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-slate-950 tracking-tight"
                            >
                                {title}
                            </motion.h2>
                        )}
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                )}

                <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group p-8 md:p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 text-slate-950 leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
