"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Specialism, STATIC_SPECIALISMS } from "@/constants/specialisms";

export type { Specialism };
export { STATIC_SPECIALISMS };

export function useSpecialisms() {
  return useQuery({
    queryKey: ["specialisms"],
    queryFn: async () => {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from("specialisms" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to static data
        return STATIC_SPECIALISMS;
      }

      return data as unknown as Specialism[];
    },
  });
}

export function useSpecialismBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["specialism", slug],
    queryFn: async () => {
      if (!slug) return null;

      // Try database first
      const { data, error } = await supabase
        .from("specialisms" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !data) {
        // Fallback to static data
        return STATIC_SPECIALISMS.find(s => s.slug === slug) || null;
      }

      return data as unknown as Specialism;
    },
    enabled: !!slug,
  });
}

export function useAgenciesBySpecialism(specialismId: string | undefined, limit = 12) {
  return useQuery({
    queryKey: ["agenciesBySpecialism", specialismId, limit],
    queryFn: async () => {
      if (!specialismId) return [];

      // Try to get agencies through the junction table
      const { data, error } = await supabase
        .from("agency_specialisms" as any)
        .select(`
          agency_id,
          is_primary,
          agencies (*)
        `)
        .eq("specialism_id", specialismId)
        .limit(limit);

      if (error || !data || data.length === 0) {
        return [];
      }

      // Extract agencies from the join result
      return data.map((item: any) => item.agencies).filter(Boolean);
    },
    enabled: !!specialismId,
  });
}

export function useAgenciesByLocationAndSpecialism(
  locationId: string | undefined,
  specialismSlug: string | undefined,
  limit = 50
) {
  return useQuery({
    queryKey: ["agenciesByLocationAndSpecialism", locationId, specialismSlug, limit],
    queryFn: async () => {
      if (!locationId || !specialismSlug) return [];

      // First get agencies for the location
      const { data: locationAgencies, error: locError } = await supabase
        .from("agency_locations")
        .select(`
          agency_id,
          agencies (*)
        `)
        .eq("location_id", locationId)
        .limit(limit);

      if (locError || !locationAgencies || locationAgencies.length === 0) {
        return [];
      }

      // Try to get specialism ID from slug
      const { data: specialism } = await supabase
        .from("specialisms" as any)
        .select("id")
        .eq("slug", specialismSlug)
        .maybeSingle();

      // If no specialism table exists or specialism not found, return all location agencies
      if (!specialism) {
        return locationAgencies.map((item: any) => item.agencies).filter(Boolean);
      }

      const agencyIds = locationAgencies.map(al => al.agency_id);
      const specialismId = (specialism as any).id;

      // Get agencies that also have the specialism
      const { data: specialismAgencies } = await supabase
        .from("agency_specialisms" as any)
        .select("agency_id")
        .eq("specialism_id", specialismId)
        .in("agency_id", agencyIds);

      if (!specialismAgencies || specialismAgencies.length === 0) {
        // Fallback: return location agencies if no specialism match
        return locationAgencies.map((item: any) => item.agencies).filter(Boolean);
      }

      // Filter to only agencies with the specialism
      const matchingAgencyIds = new Set((specialismAgencies as any[]).map(sa => sa.agency_id));
      return locationAgencies
        .filter((item: any) => matchingAgencyIds.has(item.agency_id))
        .map((item: any) => item.agencies)
        .filter(Boolean);
    },
    enabled: !!locationId && !!specialismSlug,
  });
}
