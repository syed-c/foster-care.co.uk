"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ContentBlock = Tables<"page_content_blocks">;

/**
 * Custom hook to fetch content blocks for a specific page.
 * Leverages React Query for caching and efficient state management.
 */
export function usePageBlocks(pageKey: string | undefined) {
    return useQuery<ContentBlock[]>({
        queryKey: ["page-blocks", pageKey],
        queryFn: async () => {
            if (!pageKey) return [];

            const { data, error } = await supabase
                .from("page_content_blocks")
                .select("*")
                .eq("page_key", pageKey)
                .eq("is_active", true)
                .order("display_order");

            if (error) throw error;
            return data || [];
        },
        enabled: !!pageKey,
    });
}

/**
 * Helper to extract a specific block from the blocks array.
 */
export function getBlock(blocks: ContentBlock[] | undefined, blockKey: string): ContentBlock | undefined {
    return blocks?.find((b) => b.block_key === blockKey);
}
