import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define types for our content structure
export interface CountryPageContent {
  title?: string;
  intro?: {
    heading?: string;
    paragraphs?: string[];
  };
  why_fostering_matters?: {
    heading?: string;
    paragraphs?: string[];
  };
  agency_types?: {
    heading?: string;
    intro?: string;
    independent: {
      title: string;
      description: string;
      benefits?: string[];
    };
    local_authority: {
      title: string;
      description: string;
      benefits?: string[];
    };
  };
  types_of_fostering?: {
    heading?: string;
    intro?: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  how_to_become?: {
    heading?: string;
    note?: string;
    steps: Array<{
      name: string;
      description: string;
    }>;
  };
  support?: {
    heading?: string;
    categories: Array<{
      name: string;
      description: string;
    }>;
  };
  regions?: {
    heading?: string;
    list: string[];
  };
  faq?: {
    heading?: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  ofsted?: {
    heading?: string;
    description?: string;
  };
  glossary?: {
    heading?: string;
    items: {
      [key: string]: string;
    };
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
}

export interface CountryPageData {
  id: string;
  slug: string;
  title: string;
  content: CountryPageContent;
  seo_title?: string;
  seo_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCountryPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["countryPage", slug],
    queryFn: async (): Promise<CountryPageData | null> => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("country_pages" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as unknown as CountryPageData | null;
    },
    enabled: !!slug,
  });
}
