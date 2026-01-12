import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RegionPageData {
  title: string;
  content: {
    title?: string;
    intro?: {
      paragraphs?: string[];
    };
    why_fostering_matters?: {
      heading?: string;
      paragraphs?: string[];
    };
    agency_types?: {
      heading?: string;
      intro?: string;
      independent?: {
        title: string;
        description?: string;
        benefits?: string[];
      };
      local_authority?: {
        title: string;
        description?: string;
        benefits?: string[];
      };
    };
    types_of_fostering?: {
      heading?: string;
      intro?: string;
      categories?: {
        name: string;
        description: string;
      }[];
    };
    how_to_become?: {
      heading?: string;
      note?: string;
      steps?: {
        name: string;
        description: string;
      }[];
    };
    ofsted?: {
      heading?: string;
      description?: string;
    };
    support?: {
      heading?: string;
      categories?: {
        name: string;
        description: string;
      }[];
    };
    regions?: {
      heading?: string;
      list?: string[];
    };
    glossary?: {
      heading?: string;
      items: Record<string, string>;
    };
    faq?: {
      heading?: string;
      questions?: {
        question: string;
        answer: string;
      }[];
    };
    responsibility?: {
      heading?: string;
      paragraph?: string;
    };
    cta?: {
      heading?: string;
      paragraph?: string;
      button_text?: string;
    };
  };
}

export const useRegionPage = (slug: string) => {
  return useQuery<RegionPageData | null>({
    queryKey: ['region-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_content')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching region page:', error);
        return null;
      }

      return data;
    },
    enabled: !!slug,
  });
};