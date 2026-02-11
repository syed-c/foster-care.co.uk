"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Use the actual database schema type
export type CmsContent = Tables<"cms_content">;

// Fetch all CMS content for a specific page
export function useCmsContentByPage(pageKey: string | undefined) {
  return useQuery<CmsContent[]>({
    queryKey: ["cms-content", "page", pageKey],
    queryFn: async () => {
      if (!pageKey) return [];

      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("page_key", pageKey)
        .eq("is_active", true)
        .order("section");

      if (error) throw error;
      return data || [];
    },
    enabled: !!pageKey,
  });
}

// Fetch a specific CMS content section
export function useCmsContentSection(pageKey: string | undefined, sectionKey: string) {
  return useQuery<CmsContent | null>({
    queryKey: ["cms-content", "section", pageKey, sectionKey],
    queryFn: async () => {
      if (!pageKey) return null;

      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("page_key", pageKey)
        .eq("section", sectionKey)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data;
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
  return contents?.find((c) => c.section === sectionKey);
}
