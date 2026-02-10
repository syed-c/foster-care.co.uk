"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Agency = Tables<'agencies'>;

export const useAgenciesByRegion = (regionSlug: string, limit: number = 6) => {
  return useQuery<Agency[]>({
    queryKey: ['agencies-by-region', regionSlug, limit],
    queryFn: async (): Promise<Agency[]> => {
      // First, get the location for this region slug
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select('id, name')
        .eq('slug', regionSlug)
        .single();

      if (locationError || !location) {
        console.error('Error fetching location:', locationError);
        // Fallback: search agencies by region name in city/address
        const regionName = regionSlug.replace(/-/g, ' ');
        const { data: agenciesByName, error: agencyError } = await supabase
          .from('agencies')
          .select('*')
          .or(`city.ilike.%${regionName}%,address.ilike.%${regionName}%`)
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(limit);

        if (agencyError) {
          console.error('Error fetching agencies by name:', agencyError);
          return [];
        }
        return agenciesByName as Agency[] || [];
      }

      // Get agencies that have this location in their agency_locations
      const { data: agencyLocations, error: alError } = await supabase
        .from('agency_locations')
        .select('agency_id')
        .eq('location_id', location.id);

      if (alError) {
        console.error('Error fetching agency_locations:', alError);
      }

      const agencyIds = agencyLocations?.map(al => al.agency_id) || [];

      if (agencyIds.length > 0) {
        const { data: agencies, error: agenciesError } = await supabase
          .from('agencies')
          .select('*')
          .in('id', agencyIds)
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(limit);

        if (agenciesError) {
          console.error('Error fetching agencies:', agenciesError);
          return [];
        }
        return agencies as Agency[] || [];
      }

      // Fallback: search by location name in city/address
      const { data: agenciesByCity, error: cityError } = await supabase
        .from('agencies')
        .select('*')
        .or(`city.ilike.%${location.name}%,address.ilike.%${location.name}%`)
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (cityError) {
        console.error('Error fetching agencies by city:', cityError);
        return [];
      }

      return agenciesByCity as Agency[] || [];
    },
    enabled: !!regionSlug,
  });
};
