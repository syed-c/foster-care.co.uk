"use client";
import { ReactNode, Fragment } from "react";
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

    // Handle Image Blocks
    if (block.block_type === 'image') {
        const metadata = block.metadata as Record<string, any>;
        return (
            <img
                src={metadata?.url || block.content}
                alt={metadata?.alt || block.title || 'Image'}
                className={className}
            />
        );
    }

    // Handle Semantic Headings & Paragraphs
    // If the content itself is plain text, we wrap it.
    // If it's HTML (from rich text editor), we typically render it directly, 
    // but if the user explicitly chose "Heading 1" type, they might expect the tag wrapper 
    // tailored to the content. However, usually the rich text editor inside a "Heading 1" block 
    // might just be text. Let's assume for semantic types the content is text-ish 
    // unless it looks like HTML.

    // Check if content looks like HTML
    const isRichContent = /<[a-z][\s\S]*>/i.test(block.content);

    // If it's a semantic type but NOT rich text (plain text entered), wrap it:
    if (!isRichContent) {
        switch (block.block_type) {
            case 'h1': return <h1 className={className}>{block.content}</h1>;
            case 'h2': return <h2 className={className}>{block.content}</h2>;
            case 'h3': return <h3 className={className}>{block.content}</h3>;
            case 'h4': return <h4 className={className}>{block.content}</h4>;
            case 'p': return <p className={className}>{block.content}</p>;
        }
    }

    // Handle HTML content (explicit prop OR detected rich content OR block type 'text' which is now rich)
    if (asHtml || isRichContent || block.block_type === 'text') {
        // Convert newlines to <br> ONLY if it's NOT rich content (to preserve legacy textarea behavior)
        // If it detected HTML tags, assume pre-formatted.
        const finalContent = isRichContent
            ? block.content
            : block.content.replace(/\n/g, "<br />");

        return (
            <span
                className={className}
                dangerouslySetInnerHTML={{ __html: finalContent }}
            />
        );
    }

    // Handle plain text content (legacy fallback)
    const lines = block.content.split('\n');
    const contentWithBreaks = lines.map((text, i) => (
        <Fragment key={i}>
            {text}
            {i < lines.length - 1 && <br />}
        </Fragment>
    ));

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
