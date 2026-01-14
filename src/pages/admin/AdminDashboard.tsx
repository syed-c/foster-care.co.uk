import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, MapPin, Users, MessageSquare, TrendingUp, Eye, 
  FileText, HelpCircle, Star, Settings, Plus, ArrowRight,
  CheckCircle, Clock, AlertCircle, ExternalLink
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
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
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

  const mainStats = [
    { name: "Total Agencies", value: agencies?.length || 0, icon: Building2, href: "/admin/agencies", color: "text-blue-600" },
    { name: "Locations", value: locations?.length || 0, icon: MapPin, href: "/admin/locations", color: "text-green-600" },
    { name: "Total Leads", value: leadsStats?.total || 0, icon: MessageSquare, href: "/admin/leads", color: "text-purple-600" },
    { name: "Users", value: usersStats?.total || 0, icon: Users, href: "/admin/users", color: "text-orange-600" },
  ];

  const secondaryStats = [
    { name: "New Leads", value: leadsStats?.new || 0, icon: Eye, color: "text-primary", status: "warning" },
    { name: "Pending Reviews", value: reviewsStats?.pending || 0, icon: Star, color: "text-yellow-600", status: reviewsStats?.pending ? "warning" : "success" },
    { name: "Blog Posts", value: blogStats?.total || 0, icon: FileText, href: "/admin/blog" },
    { name: "FAQs", value: faqsCount || 0, icon: HelpCircle, href: "/admin/faqs" },
  ];

  const quickActions = [
    { label: "Add Agency", href: "/admin/agencies", icon: Building2 },
    { label: "Add Location", href: "/admin/locations", icon: MapPin },
    { label: "New Blog Post", href: "/admin/blog", icon: FileText },
    { label: "Add FAQ", href: "/admin/faqs", icon: HelpCircle },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Manage Reviews", href: "/admin/reviews", icon: Star },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">New</Badge>;
      case "contacted":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Contacted</Badge>;
      case "converted":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Dashboard" description="Complete overview of your Foster Care UK platform">
      {/* Main Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => (
          <Link key={stat.name} to={stat.href}>
            <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className={`text-3xl font-semibold mt-1 ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> View all
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {secondaryStats.map((stat) => (
          <Card key={stat.name} className="bg-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color || "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.name}</p>
              </div>
              {stat.status === "warning" && stat.value > 0 && (
                <AlertCircle className="w-4 h-4 text-amber-500 ml-auto" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Leads</CardTitle>
              <CardDescription>Latest enquiries from potential foster carers</CardDescription>
            </div>
            <Link to="/admin/leads">
              <Button variant="ghost" size="sm">
                View all <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lead.first_name} {lead.last_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lead.status || "new")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No leads yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
              <CardDescription>Latest reviews requiring moderation</CardDescription>
            </div>
            <Link to="/admin/reviews">
              <Button variant="ghost" size="sm">
                View all <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-3">
                {recentReviews.map((review: any) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{review.author_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {(review.agencies as any)?.name || "Unknown Agency"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                      {review.is_approved ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Platform Overview</CardTitle>
          <CardDescription>Summary of all platform sections and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Agencies</span>
              </div>
              <p className="text-2xl font-bold">{agencies?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {agencies?.filter((a: any) => a.is_verified).length || 0} verified
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Reviews</span>
              </div>
              <p className="text-2xl font-bold">{reviewsStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {reviewsStats?.pending || 0} pending approval
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium">Blog Posts</span>
              </div>
              <p className="text-2xl font-bold">{blogStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {blogStats?.published || 0} published
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Leads</span>
              </div>
              <p className="text-2xl font-bold">{leadsStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {leadsStats?.converted || 0} converted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
