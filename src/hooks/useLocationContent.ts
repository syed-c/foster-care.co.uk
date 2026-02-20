import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LocationContent {
  id: string;
  slug: string;
  title: string;
  content: LocationContentData;
  updated_at: string;
}

export interface LocationContentData {
  title?: string;
  cta?: {
    heading: string;
    paragraph: string;
    button_text: string;
  };
  faq?: {
    heading: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  intro?: {
    paragraphs: string[];
  };
  ofsted?: {
    heading: string;
    description: string;
  };
  regions?: {
    heading: string;
    list: string[];
  };
  support?: {
    heading: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  agency_types?: {
    heading: string;
    intro: string;
    comparison_points: string[];
    independent: {
      title: string;
      benefits: string[];
    };
    local_authority: {
      title: string;
      benefits: string[];
    };
  };
  how_to_become?: {
    heading: string;
    steps: Array<{
      name: string;
      description: string;
    }>;
    note: string;
  };
  responsibility?: {
    heading: string;
    paragraph: string;
  };
  types_of_fostering?: {
    heading: string;
    intro: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  how_fostering_works?: {
    heading: string;
    paragraphs: string[];
    qualities: string[];
  };
  why_fostering_matters?: {
    heading: string;
    paragraphs: string[];
  };
}

export function useLocationContent(slug: string | undefined) {
  return useQuery<LocationContent | null>({
    queryKey: ["location-content", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const cleanSlug = slug.toLowerCase().trim();
      
      // Try different matching strategies
      const strategies = [
        // Exact match
        () => supabase.from("location_content").select("*").eq("slug", cleanSlug).maybeSingle(),
        // With prefix "loc_"
        () => supabase.from("location_content").select("*").eq("slug", `loc_${cleanSlug}`).maybeSingle(),
        // Case insensitive
        () => supabase.from("location_content").select("*").ilike("slug", cleanSlug).maybeSingle(),
      ];
      
      let data = null;
      let lastError = null;
      
      for (const strategy of strategies) {
        const result = await strategy();
        if (result.data) {
          data = result.data;
          break;
        }
        if (result.error) {
          lastError = result.error;
        }
      }
      
      if (!data && lastError) {
        console.error("Supabase query error:", lastError);
      }
      
      if (!data) {
        return null;
      }
      
      if (data.content) {
        return {
          ...data,
          content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content
        } as LocationContent;
      }
      
      return null;
    },
    enabled: !!slug,
  });
}

export function getContentValue(content: LocationContent | null, path: string, fallback: string): string {
  if (!content?.content) return fallback;
  
  const keys = path.split(".");
  let value: unknown = content.content;
  
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return fallback;
    }
  }
  
  return typeof value === "string" ? value : fallback;
}
