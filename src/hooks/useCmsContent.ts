import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CmsContent {
  id: string;
  page_key: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

// Fetch all CMS content for a specific page
export function useCmsContentByPage(pageKey: string | undefined) {
  return useQuery({
    queryKey: ["cms-content", "page", pageKey],
    queryFn: async () => {
      if (!pageKey) return [];
      
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("page_key", pageKey)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as CmsContent[];
    },
    enabled: !!pageKey,
  });
}

// Fetch a specific CMS content section
export function useCmsContentSection(pageKey: string | undefined, sectionKey: string) {
  return useQuery({
    queryKey: ["cms-content", "section", pageKey, sectionKey],
    queryFn: async () => {
      if (!pageKey) return null;
      
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("page_key", pageKey)
        .eq("section_key", sectionKey)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as CmsContent | null;
    },
    enabled: !!pageKey,
  });
}

// Fetch FAQs for a specific page
export function useFaqsByPage(pageKey: string | undefined) {
  return useQuery({
    queryKey: ["faqs", "page", pageKey],
    queryFn: async () => {
      if (!pageKey) return [];
      
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("page_key", pageKey)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data;
    },
    enabled: !!pageKey,
  });
}

// Helper to get content by section from an array of content
export function getContentBySection(contents: CmsContent[] | undefined, sectionKey: string): CmsContent | undefined {
  return contents?.find((c) => c.section_key === sectionKey);
}
