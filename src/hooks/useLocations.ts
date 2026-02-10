"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Location = Tables<"locations">;

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useLocationBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["location", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Location | null;
    },
    enabled: !!slug,
  });
}

// Resolve a location from a URL path array like ['england', 'north-west-england', 'blackpool']
// Returns the deepest valid location found
export function useLocationFromPath(pathSegments: string[]) {
  return useQuery({
    queryKey: ["locationFromPath", pathSegments.join("/")],
    queryFn: async () => {
      if (!pathSegments || pathSegments.length === 0) return null;
      
      // Try to find the deepest location by checking the last segment first
      // This handles cases like /locations/england/blackpool where blackpool is directly under england
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      const { data: location, error } = await supabase
        .from("locations")
        .select("*")
        .eq("slug", lastSegment)
        .maybeSingle();

      if (error) {
        console.error("Error finding location:", error);
        return null;
      }
      
      return location as Location | null;
    },
    enabled: pathSegments.length > 0,
  });
}

export function useChildLocations(parentId: string | undefined) {
  return useQuery({
    queryKey: ["childLocations", parentId],
    queryFn: async () => {
      if (!parentId) return [];
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("parent_id", parentId)
        .order("name");

      if (error) throw error;
      return data as Location[];
    },
    enabled: !!parentId,
  });
}

export function useTopLevelLocations() {
  return useQuery({
    queryKey: ["topLevelLocations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .is("parent_id", null)
        .order("name");

      if (error) throw error;
      return data as Location[];
    },
  });
}

// Get full path from root to location
export function useLocationPath(locationId: string | undefined) {
  return useQuery({
    queryKey: ["locationPath", locationId],
    queryFn: async () => {
      if (!locationId) return [];
      
      const path: Location[] = [];
      let currentId: string | null = locationId;
      
      while (currentId) {
        const { data, error } = await supabase
          .from("locations")
          .select("*")
          .eq("id", currentId)
          .single();
        
        if (error || !data) break;
        path.unshift(data);
        currentId = data.parent_id;
      }
      
      return path;
    },
    enabled: !!locationId,
  });
}

// Build URL path from location path array
export function buildLocationUrl(path: Location[]): string {
  if (path.length === 0) return "/locations";
  return "/locations/" + path.map(loc => loc.slug).join("/");
}
