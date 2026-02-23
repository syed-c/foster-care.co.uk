"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    ChevronDown,
    MapPin,
    Building2,
    Users,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationCounties, CountyOption } from "@/hooks/useLocationCounties";

const SERVICE_TYPES = [
    { value: "short-term", label: "Short-Term" },
    { value: "long-term", label: "Long-Term" },
    { value: "emergency", label: "Emergency" },
    { value: "respite", label: "Respite" },
    { value: "parent-child", label: "Parent & Child" },
    { value: "therapeutic", label: "Therapeutic" },
];

const AGENCY_TYPES = [
    { value: "independent", label: "Independent Fostering Agencies" },
    { value: "local-authority", label: "Local Authority Fostering" },
];

interface CountryFiltersProps {
    country: string;
}

export function CountryFilters({ country }: CountryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: counties, isLoading } = useLocationCounties(country);
    
    const [expandedFilter, setExpandedFilter] = useState<"location" | "agency" | null>(null);
    
    const [locationSearch, setLocationSearch] = useState("");
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<CountyOption | null>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    
    const [agencyType, setAgencyType] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [agencyLocation, setAgencyLocation] = useState<CountyOption | null>(null);
    const [agencyLocationSearch, setAgencyLocationSearch] = useState("");
    const [agencyLocationDropdownOpen, setAgencyLocationDropdownOpen] = useState(false);
    const agencyLocationInputRef = useRef<HTMLInputElement>(null);

    const filteredCounties = counties?.filter(county => 
        county.displayName.toLowerCase().includes(locationSearch.toLowerCase()) ||
        county.title.toLowerCase().includes(locationSearch.toLowerCase())
    ) || [];

    const filteredAgencyCounties = counties?.filter(county => 
        county.displayName.toLowerCase().includes(agencyLocationSearch.toLowerCase()) ||
        county.title.toLowerCase().includes(agencyLocationSearch.toLowerCase())
    ) || [];

    useEffect(() => {
        if (expandedFilter === "location" && locationInputRef.current) {
            locationInputRef.current.focus();
        }
    }, [expandedFilter]);

    useEffect(() => {
        if (expandedFilter === "agency" && agencyLocationInputRef.current) {
            agencyLocationInputRef.current.focus();
        }
    }, [expandedFilter]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationDropdownOpen && !(event.target as HTMLElement).closest('.location-dropdown')) {
                setLocationDropdownOpen(false);
            }
            if (agencyLocationDropdownOpen && !(event.target as HTMLElement).closest('.agency-location-dropdown')) {
                setAgencyLocationDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [locationDropdownOpen, agencyLocationDropdownOpen]);

    const handleLocationSelect = (county: CountyOption) => {
        setSelectedLocation(county);
        setLocationSearch(county.displayName);
        setLocationDropdownOpen(false);
        router.push(`/locations/${country}/${county.slug}`);
    };

    const handleAgencySearch = () => {
        if (!agencyType || !serviceType || !agencyLocation) return;
        
        const params = new URLSearchParams();
        params.set("type", agencyType);
        params.set("service", serviceType);
        params.set("location", agencyLocation.slug);
        
        router.push(`/locations/${country}?${params.toString()}`);
    };

    const closeExpandedFilter = () => {
        setExpandedFilter(null);
        setLocationSearch("");
        setSelectedLocation(null);
        setAgencyType("");
        setServiceType("");
        setAgencyLocation(null);
        setAgencyLocationSearch("");
    };

    const selectedLocationDisplay = selectedLocation?.displayName || locationSearch;

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {expandedFilter === null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-wrap gap-3"
                    >
                        <Button
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-6"
                            onClick={() => setExpandedFilter("location")}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            {selectedLocation ? (
                                <span className="truncate max-w-[200px]">{selectedLocationDisplay}</span>
                            ) : (
                                <>Fostering agencies in...</>
                            )}
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                        
                        <Button
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-6"
                            onClick={() => setExpandedFilter("agency")}
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Agencies with...
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                )}

                {expandedFilter === "location" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative location-dropdown"
                    >
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
                            <div className="flex-1 flex items-center px-4">
                                <Search className="w-4 h-4 text-white/60 mr-3" />
                                <input
                                    ref={locationInputRef}
                                    type="text"
                                    value={locationSearch}
                                    onChange={(e) => {
                                        setLocationSearch(e.target.value);
                                        setSelectedLocation(null);
                                        setLocationDropdownOpen(true);
                                    }}
                                    onFocus={() => setLocationDropdownOpen(true)}
                                    placeholder="Search counties (e.g., Kent, London...)"
                                    className="bg-transparent border-none outline-none text-white placeholder:text-white/50 w-full"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full"
                                onClick={closeExpandedFilter}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <AnimatePresence>
                            {locationDropdownOpen && filteredCounties.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                                >
                                    {filteredCounties.map((county) => (
                                        <button
                                            key={county.slug}
                                            onClick={() => handleLocationSelect(county)}
                                            className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 transition-colors"
                                        >
                                            <MapPin className="w-4 h-4 text-stone-400" />
                                            <span className="text-stone-900">{county.displayName}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isLoading && locationSearch && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-4 text-center">
                                <p className="text-stone-500">Loading counties...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {expandedFilter === "agency" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-semibold">Filter Agencies</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full"
                                onClick={closeExpandedFilter}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-2">Agency Type *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {AGENCY_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setAgencyType(type.value)}
                                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                agencyType === type.value
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-white/10 text-white hover:bg-white/20"
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/70 mb-2">Service Type *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {SERVICE_TYPES.map((service) => (
                                        <button
                                            key={service.value}
                                            onClick={() => setServiceType(service.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                serviceType === service.value
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-white/10 text-white hover:bg-white/20"
                                            }`}
                                        >
                                            {service.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative agency-location-dropdown">
                                <label className="block text-sm text-white/70 mb-2">Location *</label>
                                <div 
                                    className={`flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3 cursor-pointer ${
                                        agencyLocation ? "" : ""
                                    }`}
                                    onClick={() => agencyLocationInputRef.current?.focus()}
                                >
                                    <MapPin className="w-4 h-4 text-white/60" />
                                    <input
                                        ref={agencyLocationInputRef}
                                        type="text"
                                        value={agencyLocation ? agencyLocation.displayName : agencyLocationSearch}
                                        onChange={(e) => {
                                            setAgencyLocationSearch(e.target.value);
                                            setAgencyLocation(null);
                                            setAgencyLocationDropdownOpen(true);
                                        }}
                                        onFocus={() => setAgencyLocationDropdownOpen(true)}
                                        placeholder="Search location..."
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/50"
                                    />
                                </div>

                                <AnimatePresence>
                                    {agencyLocationDropdownOpen && filteredAgencyCounties.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 max-h-[200px] overflow-y-auto"
                                        >
                                            {filteredAgencyCounties.map((county) => (
                                                <button
                                                    key={county.slug}
                                                    onClick={() => {
                                                        setAgencyLocation(county);
                                                        setAgencyLocationSearch(county.displayName);
                                                        setAgencyLocationDropdownOpen(false);
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <MapPin className="w-4 h-4 text-stone-400" />
                                                    <span className="text-stone-900">{county.displayName}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Button
                                onClick={handleAgencySearch}
                                disabled={!agencyType || !serviceType || !agencyLocation}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full mt-4"
                            >
                                Search Agencies
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
