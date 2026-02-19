"use client";
import Link from "next/link";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, MapPin, Users, MessageSquare, TrendingUp, 
  FileText, Star, Settings, Plus, ArrowRight,
  CheckCircle, Clock, AlertCircle, ExternalLink, CreditCard,
  Eye, Sparkles, BarChart3, Globe, Shield
} from "lucide-react";
import { useAgencies } from "@/hooks/useAgencies";
import { useLocations } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: agencies } = useAgencies();
  const { data: locations } = useLocations();
  
  // Leads stats
  const { data: leadsStats } = useQuery({
    queryKey: ["admin-leads-stats"],
    queryFn: async () => {
      const [total, newLeads, contacted, converted] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "contacted"),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
      ]);
      return {
        total: total.count || 0,
        new: newLeads.count || 0,
        contacted: contacted.count || 0,
        converted: converted.count || 0,
      };
    },
  });

  // Reviews stats
  const { data: reviewsStats } = useQuery({
    queryKey: ["admin-reviews-stats"],
    queryFn: async () => {
      const [total, pending, approved] = await Promise.all([
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", true),
      ]);
      return {
        total: total.count || 0,
        pending: pending.count || 0,
        approved: approved.count || 0,
      };
    },
  });

  // Users stats
  const { data: usersStats } = useQuery({
    queryKey: ["admin-users-stats"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return { total: count || 0 };
    },
  });

  // Blog stats
  const { data: blogStats } = useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: async () => {
      const [total, published] = await Promise.all([
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      ]);
      return {
        total: total.count || 0,
        published: published.count || 0,
      };
    },
  });

  // FAQs count
  const { data: faqsCount } = useQuery({
    queryKey: ["admin-faqs-count"],
    queryFn: async () => {
      const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  // Subscriptions stats
  const { data: subscriptionStats } = useQuery({
    queryKey: ["admin-subscription-stats"],
    queryFn: async () => {
      const { count } = await supabase.from("agency_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active");
      return { active: count || 0 };
    },
  });

  // Recent leads
  const { data: recentLeads } = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, first_name, last_name, email, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  // Recent reviews
  const { data: recentReviews } = useQuery({
    queryKey: ["admin-recent-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, author_name, rating, is_approved, created_at, agency_id, agencies(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const verifiedAgencies = agencies?.filter((a: any) => a.is_verified).length || 0;
  const featuredAgencies = agencies?.filter((a: any) => a.is_featured).length || 0;

  const quickActions = [
    { label: "Add Agency", href: "/admin/agencies", icon: Building2, color: "bg-blue-500/10 text-blue-600" },
    { label: "Add Location", href: "/admin/locations", icon: MapPin, color: "bg-green-500/10 text-green-600" },
    { label: "New Post", href: "/admin/blog", icon: FileText, color: "bg-purple-500/10 text-purple-600" },
    { label: "Manage Plans", href: "/admin/subscriptions", icon: CreditCard, color: "bg-amber-500/10 text-amber-600" },
    { label: "Region CMS", href: "/admin/content", icon: Globe, color: "bg-rose-500/10 text-rose-600" },
    { label: "Settings", href: "/admin/settings", icon: Settings, color: "bg-slate-500/10 text-slate-600" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-primary/10 text-primary rounded-full text-xs">New</Badge>;
      case "contacted":
        return <Badge className="bg-amber-500/10 text-amber-600 rounded-full text-xs">Contacted</Badge>;
      case "converted":
        return <Badge className="bg-verified/10 text-verified rounded-full text-xs">Converted</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full text-xs">{status}</Badge>;
    }
  };

  return (
    <SuperAdminSidebar title="Dashboard" description="Complete overview of your Foster Care UK platform">
      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Agencies"
          value={agencies?.length || 0}
          subtitle={`${verifiedAgencies} verified • ${featuredAgencies} featured`}
          icon={Building2}
          variant="primary"
          onClick={() => window.location.href = "/admin/agencies"}
        />
        <StatCard
          title="Active Locations"
          value={locations?.length || 0}
          subtitle="UK cities & regions"
          icon={MapPin}
          variant="verified"
          onClick={() => window.location.href = "/admin/locations"}
        />
        <StatCard
          title="Total Leads"
          value={leadsStats?.total || 0}
          subtitle={`${leadsStats?.new || 0} new this week`}
          icon={MessageSquare}
          variant="warm"
          onClick={() => window.location.href = "/admin/leads"}
        />
        <StatCard
          title="Active Subscriptions"
          value={subscriptionStats?.active || 0}
          subtitle="Paying agencies"
          icon={CreditCard}
          variant="trust"
          onClick={() => window.location.href = "/admin/subscriptions"}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{reviewsStats?.pending || 0}</p>
            <p className="text-xs text-muted-foreground">Pending Reviews</p>
          </div>
          {(reviewsStats?.pending || 0) > 0 && (
            <AlertCircle className="w-4 h-4 text-amber-500 ml-auto" />
          )}
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{blogStats?.total || 0}</p>
            <p className="text-xs text-muted-foreground">Blog Posts</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{usersStats?.total || 0}</p>
            <p className="text-xs text-muted-foreground">Users</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{leadsStats?.converted || 0}</p>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl border-border mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 rounded-xl border-border hover:border-primary/30 hover:bg-accent">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
              <CardDescription className="text-xs">Latest enquiries from potential foster carers</CardDescription>
            </div>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs">
                View all <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-2">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lead.status || "new")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No leads yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="rounded-2xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Recent Reviews</CardTitle>
              <CardDescription className="text-xs">Latest reviews requiring moderation</CardDescription>
            </div>
            <Link href="/admin/reviews">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs">
                View all <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-2">
                {recentReviews.map((review: any) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{review.author_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {(review.agencies as any)?.name || "Unknown Agency"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600">{review.rating}</span>
                      </div>
                      {review.is_approved ? (
                        <CheckCircle className="w-4 h-4 text-verified" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="rounded-2xl border-border mt-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Platform Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-verified/5 border border-verified/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-verified" />
                <span className="font-medium text-sm">Directory</span>
              </div>
              <p className="text-2xl font-bold text-verified">{agencies?.length || 0}</p>
              <p className="text-xs text-muted-foreground">agencies listed</p>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">SEO Pages</span>
              </div>
              <p className="text-2xl font-bold text-primary">{locations?.length || 0}</p>
              <p className="text-xs text-muted-foreground">UK city pages</p>
            </div>
            
            <div className="p-4 bg-warm/5 border border-warm/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-warm" />
                <span className="font-medium text-sm">Inquiries</span>
              </div>
              <p className="text-2xl font-bold text-warm">{leadsStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground">total leads tracked</p>
            </div>
            
            <div className="p-4 bg-trust/5 border border-trust/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-trust" />
                <span className="font-medium text-sm">Content</span>
              </div>
              <p className="text-2xl font-bold text-trust">{blogStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground">articles published</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SuperAdminSidebar>
  );
}
