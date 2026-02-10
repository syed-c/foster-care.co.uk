"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { ReviewManagement } from "@/components/agency/ReviewManagement";
import {
  Building2,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Phone,
  Mail,
  Settings,
  Loader2,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;
type Lead = Tables<"leads">;
type Review = Tables<"reviews">;

const AgencyDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch agency owned by this user
  const { data: agency, isLoading: agencyLoading } = useQuery({
    queryKey: ["user-agency", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data as Agency | null;
    },
    enabled: !!user?.id,
  });

  // Fetch leads for this agency
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["agency-leads", agency?.id],
    queryFn: async () => {
      if (!agency) return [];
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("source_agency_id", agency.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!agency?.id,
  });

  // Fetch reviews for this agency
  const { data: reviews } = useQuery({
    queryKey: ["agency-reviews", agency?.id],
    queryFn: async () => {
      if (!agency) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!agency?.id,
  });

  if (loading || agencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // If user doesn't have an agency, show claim/register message
  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col bg-background-warm">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-semibold mb-4">No Agency Found</h1>
            <p className="text-muted-foreground mb-8">
              You don't have an agency profile yet. Claim your existing agency or register a new one to start receiving leads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/claim">Claim Your Agency</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register-agency">Register New Agency</Link>
              </Button>
            </div>
          </div>
        </main>

      </div>
    );
  }

  const newLeadsCount = leads?.filter(l => !l.is_viewed).length || 0;
  const totalLeadsCount = leads?.length || 0;
  const avgRating = agency.rating || 0;
  const reviewsCount = reviews?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Agency Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {agency.logo_url ? (
                <img
                  src={agency.logo_url}
                  alt={agency.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">{agency.name}</h1>
                  {agency.is_verified && (
                    <Badge variant="default">Verified</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{agency.city}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link href={`/agencies/${agency.slug}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/agency/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{newLeadsCount}</p>
                    <p className="text-sm text-muted-foreground">New Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{totalLeadsCount}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{avgRating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{reviewsCount}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Leads and Reviews */}
          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList className="bg-secondary/20 border">
              <TabsTrigger value="leads" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Leads ({totalLeadsCount})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reviews ({reviewsCount})
              </TabsTrigger>
              <TabsTrigger value="manage-reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Manage Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Enquiries from potential foster carers</CardDescription>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : leads && leads.length > 0 ? (
                    <div className="space-y-4">
                      {leads.slice(0, 10).map((lead: any) => (
                        <div
                          key={lead.id}
                          className={`p-4 rounded-xl border transition-colors ${!lead.is_viewed ? "bg-primary/5 border-primary/20" : "bg-card"
                            }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">
                                  {lead.first_name} {lead.last_name}
                                </h4>
                                {!lead.is_viewed && (
                                  <Badge variant="default" className="text-xs">New</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                                {lead.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </span>
                                )}
                              </div>
                              {lead.message && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {lead.message}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No leads yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>What foster carers say about you</CardDescription>
                </CardHeader>
                <CardContent>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="p-4 rounded-xl border bg-card">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{review.author_name}</span>
                              {review.is_verified && (
                                <Badge variant="outline" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {review.is_approved ? (
                                <Badge variant="default">Approved</Badge>
                              ) : (
                                <Badge variant="destructive">Pending</Badge>
                              )}
                              {review.is_featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-medium mb-1">{review.title}</h4>
                          )}
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                          {review.admin_response && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground font-medium">Admin Response</p>
                              <p className="text-sm text-muted-foreground">{review.admin_response}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage-reviews">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Manage Reviews
                  </CardTitle>
                  <CardDescription>Add, edit, or manage reviews for your agency</CardDescription>
                </CardHeader>
                <CardContent>
                  {agency ? (
                    <ReviewManagement agencyId={agency.id} />
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Please select an agency to manage reviews</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

    </div>
  );
};

export default AgencyDashboard;
