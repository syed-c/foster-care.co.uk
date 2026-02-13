"use client";
import { ReactNode } from "react";
import { ContentBlock } from "@/hooks/usePageBlocks";

interface DynamicContentProps {
    block?: ContentBlock;
    fallback?: ReactNode;
    /**
     * If true, content will be rendered as HTML.
     * Use with caution as this can be dangerous if the content is not trusted.
     */
    asHtml?: boolean;
    /**
     * Optional className for the wrapper element.
     */
    className?: string;
}

/**
 * A helper component to render content from a ContentBlock with a reliable fallback.
 * It handles the logic of checking if the block is active and providing the fallback
 * if no block content is available.
 */
export function DynamicContent({
    block,
    fallback,
    asHtml = false,
    className = "",
}: DynamicContentProps) {
    if (!block || !block.is_active || !block.content) {
        return <>{fallback}</>;
    }

    if (asHtml) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: block.content }}
            />
        );
    }

    return <span className={className}>{block.content}</span>;
}

/**
 * Component specifically for dynamic metadata-driven values like button labels or image URLs.
 */
export function getBlockMetadata(block: ContentBlock | undefined, key: string, fallback: string): string {
    if (!block || !block.is_active || !block.metadata) return fallback;
    const metadata = block.metadata as Record<string, any>;
    return metadata[key] || fallback;
}
