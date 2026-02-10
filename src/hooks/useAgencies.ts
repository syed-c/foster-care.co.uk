"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Agency = Tables<"agencies">;

export interface AgencyFilters {
  search?: string;
  location?: string;
  service?: string;
  minRating?: number;
  isFeatured?: boolean;
}

export function useAgencies(filters?: AgencyFilters) {
  return useQuery({
    queryKey: ["agencies", filters],
    queryFn: async () => {
      let query = supabase
        .from("agencies")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false, nullsFirst: false });

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters?.location) {
        query = query.ilike("city", `%${filters.location}%`);
      }

      if (filters?.minRating) {
        query = query.gte("rating", filters.minRating);
      }

      if (filters?.isFeatured) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Agency[];
    },
  });
}

export function useAgencyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["agency", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Agency | null;
    },
    enabled: !!slug,
  });
}

export function useFeaturedAgencies(limit = 6) {
  return useQuery({
    queryKey: ["featuredAgencies", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("is_featured", true)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return data as Agency[];
    },
  });
}

export function useAgenciesByLocation(locationId: string | undefined, limit = 6) {
  return useQuery({
    queryKey: ["agenciesByLocation", locationId, limit],
    queryFn: async () => {
      if (!locationId) return [];

      // First get agencies linked to this location via agency_locations
      const { data: linkedAgencies, error: linkError } = await supabase
        .from("agency_locations")
        .select(`
          agency_id,
          agencies (*)
        `)
        .eq("location_id", locationId)
        .limit(limit);

      if (linkError) throw linkError;

      // Extract agencies from the joined data
      const agencies = linkedAgencies
        ?.map((item) => item.agencies)
        .filter(Boolean) as Agency[];

      return agencies || [];
    },
    enabled: !!locationId,
  });
}
