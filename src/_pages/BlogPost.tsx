"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";

import { SEOHead, getArticleSchema } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft, Clock, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ["related-posts", post?.category],
    enabled: !!post?.category,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .eq("category", post?.category)
        .neq("id", post?.id)
        .limit(3);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const readingTime = post?.content ? Math.ceil(post.content.split(/\s+/).length / 200) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>

      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={post.seo_title || `${post.title} | Foster Care UK Blog`}
        description={post.seo_description || post.excerpt || ""}
        canonicalUrl={`https://fostercare.uk/blog/${post.slug}`}
        structuredData={getArticleSchema({
          title: post.title,
          description: post.seo_description || post.excerpt || "",
          url: `https://fostercare.uk/blog/${post.slug}`,
          imageUrl: post.cover_image_url || undefined,
          publishedAt: post.published_at || post.created_at,
          author: post.author_name || "Foster Care UK"
        })}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-muted/50 to-background py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {post.category && (
              <Badge variant="outline" className="mb-4">
                {post.category}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {post.author_name && (
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  {post.author_name}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.cover_image_url && (
          <div className="container mx-auto px-4 max-w-4xl -mt-4">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-4 max-w-4xl py-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />

          {/* Tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Share this article:</span>
              <Button variant="outline" size="sm" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="bg-muted/30 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="overflow-hidden h-full group hover:shadow-lg transition-all">
                      <div className="h-40 bg-gradient-to-br from-muted to-muted/50">
                        {relatedPost.cover_image_url ? (
                          <img
                            src={relatedPost.cover_image_url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>


    </div>
  );
};

export default BlogPost;
