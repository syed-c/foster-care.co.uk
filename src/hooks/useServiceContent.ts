import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceContent {
  id: string;
  slug: string;
  title: string;
  content: ServiceContentData;
  updated_at: string;
}

export interface ServiceContentData {
  title?: string;
  intro?: {
    paragraphs: string[];
  };
  what_it_is?: {
    heading: string;
    paragraphs: string[];
  };
  who_it_helps?: {
    heading: string;
    intro: string;
    groups: string[];
  };
  how_it_works?: {
    heading: string;
    paragraphs: string[];
  };
  carer_requirements?: {
    heading: string;
    intro: string;
    requirements: string[];
  };
  agency_types?: {
    heading: string;
    intro: string;
    independent: {
      title: string;
      description: string;
      benefits: string[];
    };
    local_authority: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
  how_to_become?: {
    heading: string;
    intro: string;
    note?: string;
    steps: Array<{
      name: string;
      description: string;
    }>;
  };
  ofsted?: {
    heading: string;
    description: string;
    criteria: string[];
  };
  support?: {
    heading: string;
    intro: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  regions?: {
    heading: string;
    intro: string;
    list: string[];
  };
  who_guide_is_for?: {
    heading: string;
    intro: string;
    audience: string[];
  };
  faq?: {
    heading: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  responsibility?: {
    heading: string;
    paragraph: string;
  };
  cta?: {
    heading: string;
    paragraph: string;
    button_text: string;
  };
}

const SERVICE_SLUGS = [
  'short-term',
  'long-term', 
  'emergency',
  'respite',
  'parent-child',
  'therapeutic'
];

export function useServiceContent(locationSlug: string | undefined, serviceSlug: string | undefined) {
  return useQuery<ServiceContent | null>({
    queryKey: ["service-content", locationSlug, serviceSlug],
    queryFn: async () => {
      if (!locationSlug || !serviceSlug) return null;
      
      if (!SERVICE_SLUGS.includes(serviceSlug.toLowerCase())) {
        return null;
      }

      const cleanLocation = locationSlug.toLowerCase().trim();
      const cleanService = serviceSlug.toLowerCase().trim();
      
      const strategies = [
        () => supabase.from("location_content").select("*").eq("slug", `${cleanLocation}/${cleanService}`).maybeSingle(),
        () => supabase.from("location_content").select("*").eq("slug", `loc_${cleanLocation}/${cleanService}`).maybeSingle(),
        () => supabase.from("location_content").select("*").eq("slug", `${cleanService}`).maybeSingle(),
        () => supabase.from("location_content").select("*").ilike("slug", `%/${cleanService}`).maybeSingle(),
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
        } as ServiceContent;
      }
      
      return null;
    },
    enabled: !!(locationSlug && serviceSlug),
  });
}

export { SERVICE_SLUGS };
