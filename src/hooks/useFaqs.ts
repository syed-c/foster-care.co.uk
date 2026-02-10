"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Faq = Tables<"faqs">;

export function useFaqs(pageKey?: string) {
  return useQuery({
    queryKey: ["faqs", pageKey],
    queryFn: async () => {
      let query = supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (pageKey) {
        query = query.eq("page_key", pageKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Faq[];
    },
  });
}

export function useFaqsByLocation(locationId: string | undefined) {
  return useQuery({
    queryKey: ["faqs", "location", locationId],
    queryFn: async () => {
      if (!locationId) return [];
      
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("location_id", locationId)
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Faq[];
    },
    enabled: !!locationId,
  });
}
