import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Agency = Tables<"agencies">;

/**
 * Fetch agencies for a specific country by finding all locations
 * within that country and their linked agencies
 */
export function useAgenciesByCountry(countrySlug: string | undefined, limit = 12) {
  return useQuery({
    queryKey: ["agenciesByCountry", countrySlug, limit],
    queryFn: async () => {
      if (!countrySlug) return [];

      // First, get the country location by slug
      const { data: countryLocation, error: countryError } = await supabase
        .from("locations")
        .select("id")
        .eq("slug", countrySlug)
        .eq("type", "country")
        .maybeSingle();

      if (countryError) throw countryError;
      if (!countryLocation) {
        // If not found as country, try to find agencies by matching city name
        const { data: directAgencies, error: directError } = await supabase
          .from("agencies")
          .select("*")
          .or(`city.ilike.%${countrySlug}%,address.ilike.%${countrySlug}%`)
          .order("is_featured", { ascending: false })
          .order("rating", { ascending: false, nullsFirst: false })
          .limit(limit);

        if (directError) throw directError;
        return directAgencies as Agency[];
      }

      // Get all child locations (regions) under this country
      const { data: childLocations, error: childError } = await supabase
        .from("locations")
        .select("id")
        .eq("parent_id", countryLocation.id);

      if (childError) throw childError;

      // Collect all location IDs (country + all child regions)
      const allLocationIds = [
        countryLocation.id,
        ...(childLocations?.map(loc => loc.id) || [])
      ];

      // Get agencies linked to any of these locations
      const { data: linkedAgencies, error: linkError } = await supabase
        .from("agency_locations")
        .select(`
          agencies (*)
        `)
        .in("location_id", allLocationIds);

      if (linkError) throw linkError;

      // Extract unique agencies
      const agencyMap = new Map<string, Agency>();
      linkedAgencies?.forEach(item => {
        const agency = item.agencies as Agency;
        if (agency && !agencyMap.has(agency.id)) {
          agencyMap.set(agency.id, agency);
        }
      });

      // Convert to array and sort
      const agencies = Array.from(agencyMap.values())
        .sort((a, b) => {
          // Featured first
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          // Then by rating
          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, limit);

      // If no linked agencies found, fallback to searching by country name in city field
      if (agencies.length === 0) {
        const { data: fallbackAgencies, error: fallbackError } = await supabase
          .from("agencies")
          .select("*")
          .order("is_featured", { ascending: false })
          .order("rating", { ascending: false, nullsFirst: false })
          .limit(limit);

        if (fallbackError) throw fallbackError;
        return fallbackAgencies as Agency[];
      }

      return agencies;
    },
    enabled: !!countrySlug,
  });
}