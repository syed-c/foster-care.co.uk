"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface FAQItem {
    question: string;
    answer: string;
    category?: string;
    emoji?: string;
    popular?: boolean;
}

interface CollapsibleFAQProps {
    items: FAQItem[];
    showSearch?: boolean;
    className?: string;
    inverted?: boolean;
}

export function CollapsibleFAQ({ items, showSearch = true, className, inverted = false }: CollapsibleFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = items.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={className}>
            {/* Search Bar */}
            {showSearch && items.length > 5 && (
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", inverted ? "text-slate-500" : "text-slate-400")} />
                        <Input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "pl-12 h-14 rounded-full border shadow-sm transition-all",
                                inverted
                                    ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-primary/50"
                                    : "border-slate-200 bg-white shadow-sm"
                            )}
                        />
                    </div>
                </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                            "rounded-2xl border overflow-hidden transition-all duration-300",
                            inverted
                                ? "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-primary/30 shadow-black/20"
                                : "bg-white border-slate-200/60 hover:border-primary/20 shadow-sm",
                            openIndex === index && (inverted ? "border-primary/40 bg-white/[0.08] shadow-lg shadow-black/40" : "border-primary/20 shadow-md")
                        )}
                    >
                        {/* Question Header */}
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start gap-4 text-left group"
                            aria-expanded={openIndex === index}
                        >
                            {/* Icon/Emoji */}
                            <div className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                inverted ? "bg-white/5 group-hover:bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
                            )}>
                                {faq.emoji ? (
                                    <span className="text-xl">{faq.emoji}</span>
                                ) : (
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                )}
                            </div>

                            {/* Question Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3">
                                    <h3 className={cn(
                                        "text-lg md:text-xl font-bold transition-colors leading-tight flex-1",
                                        inverted ? "text-white group-hover:text-primary" : "text-slate-950 group-hover:text-primary"
                                    )}>
                                        {faq.question}
                                    </h3>
                                    {faq.popular && (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            inverted ? "bg-primary/20 text-primary border-primary/20" : "bg-amber-100 text-amber-700 border-amber-200"
                                        )}>
                                            Popular
                                        </span>
                                    )}
                                </div>
                                {faq.category && (
                                    <p className={cn("text-xs mt-1 font-medium uppercase tracking-wider", inverted ? "text-slate-500" : "text-slate-500")}>
                                        {faq.category}
                                    </p>
                                )}
                            </div>

                            {/* Chevron */}
                            <motion.div
                                animate={{ rotate: openIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0"
                            >
                                <ChevronDown className={cn("w-5 h-5 transition-colors", inverted ? "text-slate-500 group-hover:text-primary" : "text-slate-400 group-hover:text-primary")} />
                            </motion.div>
                        </button>

                        {/* Answer Content */}
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className={cn("px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t", inverted ? "border-white/5" : "border-slate-50")}>
                                        <div
                                            className={cn(
                                                "text-base md:text-lg leading-relaxed font-medium prose prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline max-w-none",
                                                inverted ? "text-slate-400 prose-invert" : "text-slate-600 prose-slate"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                    <p className={cn("text-lg", inverted ? "text-slate-500" : "text-slate-500")}>No questions found matching "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
}
