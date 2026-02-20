import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailableRegion {
  slug: string;
  title: string;
}

export function useAvailableRegions(countrySlug: string = "england") {
  return useQuery<AvailableRegion[]>({
    queryKey: ["available-regions", countrySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_content")
        .select("slug, title")
        .like("slug", `${countrySlug}/%`);

      if (error) {
        console.error("Error fetching available regions:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((item) => ({
        slug: item.slug.replace(/^loc_/, "").replace(/^england\//, ""),
        title: item.title,
      }));
    },
  });
}
