"use client";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";

import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
  Award,
  Scale,
  X,
  Plus,
  ArrowRight
} from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;

const CompareAgencies = () => {
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [showSelector, setShowSelector] = useState(true);

  const { data: agencies, isLoading } = useQuery({
    queryKey: ["agencies-for-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as Agency[];
    },
  });

  const selectedAgencyData: Agency[] = agencies?.filter(a => selectedAgencies.includes(a.id)) || [];

  const toggleAgency = (id: string) => {
    if (selectedAgencies.includes(id)) {
      setSelectedAgencies(prev => prev.filter(a => a !== id));
    } else if (selectedAgencies.length < 4) {
      setSelectedAgencies(prev => [...prev, id]);
    }
  };

  const removeAgency = (id: string) => {
    setSelectedAgencies(prev => prev.filter(a => a !== id));
  };

  const compareFeatures = [
    { key: "ofsted_rating", label: "Ofsted Rating", icon: Award },
    { key: "rating", label: "User Rating", icon: Star },
    { key: "review_count", label: "Reviews", icon: CheckCircle2 },
    { key: "is_verified", label: "Verified", icon: CheckCircle2 },
    { key: "city", label: "Location", icon: MapPin },
  ];

  const getFeatureValue = (agency: Agency, key: string) => {
    switch (key) {
      case "rating":
        return agency.rating ? `${agency.rating}/5` : "No ratings";
      case "review_count":
        return agency.review_count || 0;
      case "is_verified":
        return agency.is_verified ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-foreground/60" />
        );
      case "ofsted_rating":
        return agency.ofsted_rating || "Not rated";
      case "phone":
        return "Hidden for privacy";
      case "email":
        return "Hidden for privacy";
      case "website":
        return "Hidden for privacy";
      default:
        return (agency as any)[key] || "N/A";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Compare Foster Care Agencies | Foster Care UK"
        description="Compare foster care agencies side by side. View ratings, services, Ofsted ratings, and more to find the perfect fostering agency for you."
        canonicalUrl="https://fostercare.uk/compare"
        keywords={["compare foster agencies", "fostering agency comparison", "best foster care agencies UK"]}
      />
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Agency Comparison Tool</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Compare Foster Care Agencies
            </h1>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Select up to 4 agencies to compare their ratings, services, and features side by side
            </p>
          </div>

          {/* Agency Selector */}
          {showSelector && (
            <Card className="p-6 mb-8 bg-card text-foreground border border-border/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Select Agencies to Compare</h3>
                <Badge variant="outline" className="text-foreground border-border">
                  {selectedAgencies.length}/4 selected
                </Badge>
              </div>

              <ScrollArea className="h-64 rounded-md border border-border/50 bg-background p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agencies?.map((agency) => (
                      <div
                        key={agency.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAgencies.includes(agency.id)
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-primary/50"
                          } ${selectedAgencies.length >= 4 && !selectedAgencies.includes(agency.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => toggleAgency(agency.id)}
                      >
                        <Checkbox
                          checked={selectedAgencies.includes(agency.id)}
                          disabled={selectedAgencies.length >= 4 && !selectedAgencies.includes(agency.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${selectedAgencies.includes(agency.id) ? 'text-foreground' : 'text-foreground/80'}`}>
                            {agency.name}
                          </p>
                          <div className={`flex items-center gap-2 text-xs ${selectedAgencies.includes(agency.id) ? 'text-foreground' : 'text-foreground/60'}`}>
                            {agency.city && <span>{agency.city}</span>}
                            {agency.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {agency.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {selectedAgencies.length >= 2 && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => setShowSelector(false)} size="lg">
                    Compare {selectedAgencies.length} Agencies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Comparison Table */}
          {selectedAgencyData.length >= 2 && !showSelector && (
            <>
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => setShowSelector(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Modify Selection
                </Button>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Agency Headers */}
                  <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedAgencyData.length}, 1fr)` }}>
                    <div />
                    {selectedAgencyData.map((agency) => (
                      <Card key={agency.id} className="p-4 relative bg-card text-foreground border border-border/50 shadow-sm">
                        <button
                          onClick={() => removeAgency(agency.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-3">
                            {agency.name.substring(0, 2).toUpperCase()}
                          </div>
                          <h3 className="font-semibold text-lg mb-1 text-foreground">{agency.name}</h3>
                          {agency.is_featured && (
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                              Featured
                            </Badge>
                          )}
                          <Link href={`/agencies/${agency.slug}`}>
                            <Button variant="outline" size="sm" className="mt-3 w-full text-foreground border-border">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Comparison Rows */}
                  {compareFeatures.map((feature, index) => (
                    <div
                      key={feature.key}
                      className={`grid gap-4 py-4 border-b ${index % 2 === 0 ? "bg-background/50 text-foreground" : "bg-background text-foreground"}`}
                      style={{ gridTemplateColumns: `200px repeat(${selectedAgencyData.length}, 1fr)` }}
                    >
                      <div className="flex items-center gap-2 px-4">
                        <feature.icon className="h-4 w-4 text-foreground" />
                        <span className="font-medium text-sm text-foreground">{feature.label}</span>
                      </div>
                      {selectedAgencyData.map((agency) => (
                        <div key={agency.id} className="flex items-center justify-center text-sm text-foreground">
                          {getFeatureValue(agency, feature.key)}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Acceptance Types */}
                  <div
                    className="grid gap-4 py-4 border-b bg-background text-foreground"
                    style={{ gridTemplateColumns: `200px repeat(${selectedAgencyData.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 px-4">
                      <CheckCircle2 className="h-4 w-4 text-foreground" />
                      <span className="font-medium text-sm text-foreground">Acceptance Types</span>
                    </div>
                    {selectedAgencyData.map((agency) => (
                      <div key={agency.id} className="flex flex-wrap gap-1 justify-center px-2">
                        {agency.acceptance_types && Array.isArray(agency.acceptance_types) && agency.acceptance_types.length > 0 ? (
                          agency.acceptance_types.slice(0, 3).map((type, i) => (
                            <Badge key={i} variant="secondary" className="text-xs text-foreground">
                              {type}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-foreground/80 text-sm">No types listed</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Agency Type */}
                  <div
                    className="grid gap-4 py-4 bg-background text-foreground"
                    style={{ gridTemplateColumns: `200px repeat(${selectedAgencyData.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 px-4">
                      <Award className="h-4 w-4 text-foreground" />
                      <span className="font-medium text-sm text-foreground">Agency Type</span>
                    </div>
                    {selectedAgencyData.map((agency) => (
                      <div key={agency.id} className="flex flex-wrap gap-1 justify-center px-2">
                        {agency.agency_type ? (
                          <Badge variant="outline" className="text-xs text-foreground border-border">
                            {agency.agency_type}
                          </Badge>
                        ) : (
                          <span className="text-foreground/80 text-sm">Not specified</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedAgencyData.length < 2 && !showSelector && (
            <Card className="p-12 text-center bg-card text-foreground border border-border/50 shadow-lg">
              <Scale className="h-12 w-12 text-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Select at least 2 agencies</h3>
              <p className="text-foreground mb-4">
                Choose agencies from the list above to compare them side by side
              </p>
              <Button onClick={() => setShowSelector(true)} variant="secondary" className="text-foreground">
                Select Agencies
              </Button>
            </Card>
          )}
        </div>
      </main>


    </div>
  );
};

export default CompareAgencies;
