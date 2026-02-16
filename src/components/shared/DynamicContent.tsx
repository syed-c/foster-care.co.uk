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

    // Handle HTML content
    if (asHtml) {
        // Convert newlines to <br> for HTML content if they aren't already valid HTML breaks
        // This helps when users type in the textarea and expect line breaks
        const processedContent = block.content.replace(/\n/g, "<br />");

        return (
            <span
                className={className}
                dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        );
    }

    // Handle plain text content
    // We want to preserve newlines as <br /> tags
    const contentWithBreaks = block.content.split('\n').map((text, i, arr) => (
        <span key={i}>
            {text}
            {i < arr.length - 1 && <br />}
        </span>
    ));

    // If a className is provided, we need a wrapper (span).
    // Otherwise, we return a fragment to avoid invalid nesting (like span inside h1).
    if (className) {
        return <span className={className}>{contentWithBreaks}</span>;
    }

    return <>{contentWithBreaks}</>;
}

/**
 * Component specifically for dynamic metadata-driven values like button labels or image URLs.
 */
export function getBlockMetadata(block: ContentBlock | undefined, key: string, fallback: string): string {
    if (!block || !block.is_active || !block.metadata) return fallback;
    const metadata = block.metadata as Record<string, any>;
    return metadata[key] || fallback;
}
