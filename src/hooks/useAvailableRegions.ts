import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailableRegion {
  slug: string;
  title: string;
}

export function useAvailableRegions(childLocations: { slug: string }[] = []) {
  return useQuery<AvailableRegion[]>({
    queryKey: ["available-regions", childLocations.map(l => l.slug).join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_content")
        .select("slug, title");

      if (error) {
        console.error("Error fetching available regions:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const availableSlugs = new Set(
        data.map(item => item.slug.replace(/^loc_/, ""))
      );

      const matchingRegions = childLocations.filter(region => {
        const regionSlug = region.slug;
        return availableSlugs.has(regionSlug) || 
               availableSlugs.has(`loc_${regionSlug}`) ||
               availableSlugs.has(`england/${regionSlug}`) ||
               availableSlugs.has(`loc_england/${regionSlug}`);
      });

      return matchingRegions.map(region => {
        const dbEntry = data.find(item => {
          const cleanSlug = item.slug.replace(/^loc_/, "");
          return cleanSlug === region.slug || 
                 cleanSlug === `england/${region.slug}`;
        });
        return {
          slug: region.slug,
          title: dbEntry?.title || region.slug,
        };
      });
    },
    enabled: childLocations.length > 0,
  });
}
