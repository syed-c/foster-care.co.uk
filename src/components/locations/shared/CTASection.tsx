"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
    locationName: string;
    className?: string;
    theme?: "light" | "dark";
}

export function CTASection({ locationName, className, theme = "light" }: CTASectionProps) {
    const isDark = theme === "dark";

    return (
        <section className={cn("py-24", className)}>
            <div className="container-main px-4">
                <div className={cn(
                    "relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center shadow-2xl",
                    isDark
                        ? "bg-slate-950 text-white border border-white/5"
                        : "bg-white text-slate-950 border border-slate-100"
                )}>
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-8 border border-primary/20">
                                <MessageCircle className="w-3.5 h-3.5" />
                                Start Your Journey
                            </div>

                            <h2 className={cn(
                                "text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-tight",
                                isDark ? "text-white" : "text-slate-950"
                            )}>
                                Ready to Foster in <span className="text-primary">{locationName}?</span>
                            </h2>

                            <p className={cn(
                                "text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed",
                                isDark ? "text-white/70" : "text-slate-600"
                            )}>
                                Take the first step today. We'll connect you with the most suitable local agencies who will guide you every step of the way.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white font-black h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl shadow-xl shadow-primary/20 group hover:scale-105 transition-all duration-300"
                                >
                                    Enquire Now
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className={cn(
                                        "w-full sm:w-auto rounded-full font-black h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl border-2 hover:scale-105 transition-all duration-300",
                                        isDark
                                            ? "border-white bg-white text-slate-950 hover:bg-white/90"
                                            : "border-slate-200 text-slate-950 hover:bg-slate-50"
                                    )}
                                >
                                    View Agencies
                                </Button>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-8 border-t pt-12 border-slate-100/10">
                                <div className="text-center">
                                    <div className={cn("text-2xl font-black", isDark ? "text-white" : "text-slate-950")}>24/7</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-primary">Support</div>
                                </div>
                                <div className="w-px h-10 bg-slate-100/10" />
                                <div className="text-center">
                                    <div className={cn("text-2xl font-black", isDark ? "text-white" : "text-slate-950")}>Full</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-primary">Training</div>
                                </div>
                                <div className="w-px h-10 bg-slate-100/10" />
                                <div className="text-center">
                                    <div className={cn("text-2xl font-black", isDark ? "text-white" : "text-slate-950")}>Local</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-primary">Benefits</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
