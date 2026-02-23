"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FilteredAgenciesProps {
    type: string;
    service: string;
    location: string;
}

interface Agency {
    id: string;
    name: string;
    slug: string;
    address?: string;
    phone?: string;
    website?: string;
    rating?: number;
    review_count?: number;
    agency_type?: string;
    services?: string[];
}

export function FilteredAgencies({ type, service, location }: FilteredAgenciesProps) {
    const { data: agencies, isLoading, error } = useQuery<Agency[]>({
        queryKey: ["filtered-agencies", type, service, location],
        queryFn: async () => {
            let query = supabase
                .from("agencies")
                .select("*")
                .limit(50);

            if (type === "independent") {
                query = query.ilike("agency_type", "%independent%");
            } else if (type === "local-authority") {
                query = query.ilike("agency_type", "%local%authority%");
            }

            if (service) {
                query = query.ilike("services", `%${service}%`);
            }

            if (location) {
                query = query.or(`address.ilike.%${location}%,location.ilike.%${location}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching agencies:", error);
                return [];
            }

            return data || [];
        },
        enabled: !!type && !!service && !!location,
    });

    const serviceLabels: Record<string, string> = {
        "short-term": "Short-Term",
        "long-term": "Long-Term",
        "emergency": "Emergency",
        "respite": "Respite",
        "parent-child": "Parent & Child",
        "therapeutic": "Therapeutic",
    };

    const typeLabels: Record<string, string> = {
        "independent": "Independent Fostering Agencies",
        "local-authority": "Local Authority",
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-stone-100">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !agencies || agencies.length === 0) {
        return (
            <div className="text-center py-12 bg-stone-50 rounded-xl">
                <p className="text-stone-600 mb-4">
                    No agencies found matching your criteria.
                </p>
                <p className="text-sm text-stone-500">
                    Try adjusting your filters or browse all agencies.
                </p>
                <Button asChild className="mt-4 rounded-full">
                    <Link href="/agencies">
                        Browse All Agencies
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-stone-600">
                    Found <span className="font-semibold text-slate-900">{agencies.length}</span> agencies
                    {typeLabels[type] && <> matching <span className="font-semibold">{typeLabels[type]}</span></>}
                    {service && <> offering <span className="font-semibold">{serviceLabels[service] || service}</span></>}
                    {location && <> in <span className="font-semibold">{location}</span></>}
                </p>
            </div>

            <div className="space-y-4">
                {agencies.map((agency) => (
                    <motion.div
                        key={agency.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-200"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {agency.name}
                                </h3>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-stone-600 mb-3">
                                    {agency.address && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {agency.address}
                                        </span>
                                    )}
                                    {agency.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {agency.phone}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {agency.rating && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                                            <Star className="w-3 h-3 fill-current" />
                                            {agency.rating}
                                        </span>
                                    )}
                                    {agency.agency_type && (
                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                                            {agency.agency_type}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                                    <Link href={`/agencies/${agency.slug}`}>
                                        View Profile
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                {agency.website && (
                                    <Button variant="outline" asChild className="rounded-full">
                                        <a href={agency.website} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Website
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
