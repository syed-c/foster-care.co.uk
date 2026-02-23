import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CountyOption {
  slug: string;
  title: string;
  displayName: string;
}

export function useLocationCounties(country: string = "england") {
  return useQuery<CountyOption[]>({
    queryKey: ["location-counties", country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_content")
        .select("slug, title")
        .like("slug", `${country}/%`)
        .not("slug", "like", `${country}/%/%`);

      if (error) {
        console.error("Error fetching counties:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const regionNames: Record<string, string> = {
        "london": "London",
        "south-east-england": "South East England",
        "south-west-england": "South West England",
        "east-of-england": "East of England",
        "west-midlands": "West Midlands",
        "east-midlands": "East Midlands",
        "yorkshire-and-the-humber": "Yorkshire and the Humber",
        "north-west-england": "North West England",
        "north-east-england": "North East England",
      };

      return data.map(item => {
        const slugParts = item.slug.replace(`${country}/`, "").split("/");
        const regionSlug = slugParts[0];
        const regionName = regionNames[regionSlug] || regionSlug;
        
        const title = item.title || slugParts[0].replace(/-/g, " ");
        const displayName = `${title}, ${regionName}`;
        
        return {
          slug: slugParts[0],
          title: title,
          displayName: displayName,
        };
      }).sort((a, b) => a.title.localeCompare(b.title));
    },
    enabled: !!country,
  });
}
