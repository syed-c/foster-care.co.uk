"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CountyPageContent {
  id: string;
  slug: string;
  title: string;
  content: CountyContentData;
  updated_at: string;
}

export interface CountyContentData {
  title: string;
  intro: {
    paragraphs: string[];
  };
  local_character: {
    heading: string;
    paragraphs: string[];
  };
  agency_network: {
    heading: string;
    intro: string;
    towns: string[];
    outro: string;
  };
  types_of_fostering: {
    heading: string;
    intro: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  agency_types: {
    heading: string;
    intro: string;
    independent: {
      title: string;
      description: string;
    };
    local_authority: {
      title: string;
      description: string;
    };
  };
  how_to_become: {
    heading: string;
    intro: string;
    note: string;
    steps: Array<{
      name: string;
      description: string;
    }>;
  };
  ofsted: {
    heading: string;
    description: string;
    criteria: string[];
  };
  support: {
    heading: string;
    intro: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  landmarks: {
    heading: string;
    intro: string;
    paragraph: string;
    places: string[];
  };
  regions: {
    heading: string;
    intro: string;
    list: string[];
  };
  faq: {
    heading: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  responsibility: {
    heading: string;
    paragraph: string;
  };
  cta: {
    heading: string;
    paragraph: string;
    button_text: string;
  };
}

export function useCountyContent(slug: string | undefined) {
  return useQuery<CountyPageContent | null>({
    queryKey: ["county-content", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const cleanSlug = slug.toLowerCase().trim();
      
      const strategies = [
        () => supabase.from("location_content").select("*").eq("slug", cleanSlug).maybeSingle(),
        () => supabase.from("location_content").select("*").eq("slug", `loc_${cleanSlug}`).maybeSingle(),
        () => supabase.from("location_content").select("*").ilike("slug", `%${cleanSlug}`).maybeSingle(),
      ];
      
      let data = null;
      
      for (const strategy of strategies) {
        const result = await strategy();
        if (result.data) {
          data = result.data;
          break;
        }
      }
      
      if (!data) {
        return null;
      }
      
      let parsedContent = null;
      if (data.content) {
        if (typeof data.content === 'string') {
          try {
            parsedContent = JSON.parse(data.content);
          } catch (e) {
            console.error("Failed to parse content:", e);
          }
        } else if (typeof data.content === 'object') {
          parsedContent = data.content;
        }
      }
      
      if (parsedContent) {
        return {
          ...data,
          content: parsedContent
        } as CountyPageContent;
      }
      
      return null;
    },
    enabled: !!slug,
  });
}
