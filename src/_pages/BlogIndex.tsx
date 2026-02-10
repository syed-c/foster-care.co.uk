"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead, getArticleSchema } from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";

const BlogIndex = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Fostering Blog - Expert Advice & Stories | Foster Care UK"
        description="Read expert articles about fostering, foster carer stories, and helpful guides for your fostering journey. Stay informed with the latest fostering news and tips."
        canonicalUrl="https://fostercare.uk/blog"
        keywords={[
          "fostering blog",
          "foster care articles",
          "fostering advice",
          "foster carer stories",
          "UK fostering",
        ]}
      />
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fostering Resources</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Fostering Blog & <span className="text-primary">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert advice, inspiring stories, and practical guides to support your fostering journey
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden bg-[#1a2228] text-white">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="block mb-12">
                  <Card className="overflow-hidden bg-[#1a2228] text-white group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        {featuredPost.cover_image_url ? (
                          <img 
                            src={featuredPost.cover_image_url} 
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                            <span className="text-muted-foreground">Featured Article</span>
                          </div>
                        )}
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        {featuredPost.category && (
                          <Badge variant="outline" className="w-fit mb-4">
                            {featuredPost.category}
                          </Badge>
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-white/80 mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                          {featuredPost.author_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {featuredPost.author_name}
                            </span>
                          )}
                          {featuredPost.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(featuredPost.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                        <Button className="w-fit group/btn">
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Other Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden bg-[#1a2228] text-white h-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                        {post.cover_image_url ? (
                          <img 
                            src={post.cover_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        {post.category && (
                          <Badge variant="secondary" className="absolute top-3 left-3">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 group-hover:text-white transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          {post.author_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author_name}
                            </span>
                          )}
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(post.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Card className="p-12 text-center bg-[#1a2228] text-white hover:scale-105 transition-transform duration-300">
              <BookOpen className="h-16 w-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Coming Soon</h3>
              <p className="text-white">
                We're working on helpful articles and guides. Check back soon!
              </p>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogIndex;
