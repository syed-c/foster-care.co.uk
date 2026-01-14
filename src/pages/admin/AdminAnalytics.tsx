import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Building2,
  MapPin,
  MessageSquare,
  Star,
  Eye,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "7d":
        return { start: subDays(now, 7), end: now };
      case "30d":
        return { start: subDays(now, 30), end: now };
      case "90d":
        return { start: subDays(now, 90), end: now };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const { start, end } = getDateRange();

  // Fetch agencies stats
  const { data: agenciesData } = useQuery({
    queryKey: ["analytics-agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id, is_verified, is_featured, is_active, created_at, rating, review_count");
      if (error) throw error;
      return data;
    },
  });

  // Fetch leads stats
  const { data: leadsData } = useQuery({
    queryKey: ["analytics-leads", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, status, created_at, source_agency_id")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
      if (error) throw error;
      return data;
    },
  });

  // Fetch reviews stats
  const { data: reviewsData } = useQuery({
    queryKey: ["analytics-reviews", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, is_approved, created_at")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
      if (error) throw error;
      return data;
    },
  });

  // Fetch locations stats
  const { data: locationsData } = useQuery({
    queryKey: ["analytics-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, type, agency_count, is_active");
      if (error) throw error;
      return data;
    },
  });

  // Fetch inquiry events
  const { data: inquiryEvents } = useQuery({
    queryKey: ["analytics-inquiry-events", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiry_events")
        .select("id, event_type, created_at")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
      if (error) throw error;
      return data;
    },
  });

  // Calculate stats
  const totalAgencies = agenciesData?.length || 0;
  const verifiedAgencies = agenciesData?.filter(a => a.is_verified).length || 0;
  const activeAgencies = agenciesData?.filter(a => a.is_active).length || 0;
  
  const totalLeads = leadsData?.length || 0;
  const newLeads = leadsData?.filter(l => l.status === "new").length || 0;
  const convertedLeads = leadsData?.filter(l => l.status === "converted").length || 0;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  const totalReviews = reviewsData?.length || 0;
  const avgRating = reviewsData && reviewsData.length > 0 
    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
    : "0.0";
  
  const totalLocations = locationsData?.length || 0;
  const countriesCount = locationsData?.filter(l => l.type === "country").length || 0;
  const regionsCount = locationsData?.filter(l => l.type === "region").length || 0;
  const citiesCount = locationsData?.filter(l => l.type === "city").length || 0;

  const totalInquiryEvents = inquiryEvents?.length || 0;

  // Group leads by day for chart data
  const leadsByDay = leadsData?.reduce((acc, lead) => {
    const day = format(new Date(lead.created_at), "MMM d");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <AdminLayout title="Analytics" description="Platform performance and insights">
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Platform Overview</h2>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Agencies"
            value={totalAgencies}
            icon={Building2}
            subtitle={`${verifiedAgencies} verified`}
          />
          <StatCard
            title="Total Leads"
            value={totalLeads}
            icon={MessageSquare}
            trend={totalLeads > 0 ? { value: 12, label: "vs last period" } : undefined}
          />
          <StatCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={TrendingUp}
            subtitle={`${convertedLeads} converted`}
          />
          <StatCard
            title="Avg Rating"
            value={avgRating}
            icon={Star}
            subtitle={`${totalReviews} reviews`}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="agencies" className="rounded-lg">Agencies</TabsTrigger>
            <TabsTrigger value="leads" className="rounded-lg">Leads</TabsTrigger>
            <TabsTrigger value="locations" className="rounded-lg">Locations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Leads Trend */}
              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Leads Trend
                  </CardTitle>
                  <CardDescription>New leads over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {Object.entries(leadsByDay).slice(-7).map(([day, count]) => (
                      <div key={day} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="w-full bg-primary/20 rounded-t-lg transition-all relative group"
                          style={{ height: `${Math.max((count as number) * 20, 10)}px` }}
                        >
                          <div 
                            className="absolute inset-0 bg-primary rounded-t-lg"
                            style={{ height: '100%' }}
                          />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {count}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{day}</span>
                      </div>
                    ))}
                    {Object.keys(leadsByDay).length === 0 && (
                      <div className="w-full text-center py-12 text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">Active Agencies</span>
                    </div>
                    <span className="font-bold">{activeAgencies}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-verified/10">
                        <MapPin className="w-4 h-4 text-verified" />
                      </div>
                      <span className="text-sm">Coverage Areas</span>
                    </div>
                    <span className="font-bold">{totalLocations}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warm/10">
                        <Eye className="w-4 h-4 text-warm" />
                      </div>
                      <span className="text-sm">Inquiry Events</span>
                    </div>
                    <span className="font-bold">{totalInquiryEvents}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Star className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-sm">Pending Reviews</span>
                    </div>
                    <span className="font-bold">
                      {reviewsData?.filter(r => !r.is_approved).length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Agencies"
                value={totalAgencies}
                icon={Building2}
              />
              <StatCard
                title="Verified"
                value={verifiedAgencies}
                icon={Users}
                subtitle={`${Math.round((verifiedAgencies / Math.max(totalAgencies, 1)) * 100)}%`}
              />
              <StatCard
                title="Featured"
                value={agenciesData?.filter(a => a.is_featured).length || 0}
                icon={Star}
              />
              <StatCard
                title="Avg Reviews"
                value={(agenciesData?.reduce((sum, a) => sum + (a.review_count || 0), 0) / Math.max(totalAgencies, 1)).toFixed(1)}
                icon={MessageSquare}
              />
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Leads"
                value={totalLeads}
                icon={MessageSquare}
              />
              <StatCard
                title="New"
                value={newLeads}
                icon={Users}
                variant="primary"
              />
              <StatCard
                title="Converted"
                value={convertedLeads}
                icon={TrendingUp}
                variant="verified"
              />
              <StatCard
                title="Conversion Rate"
                value={`${conversionRate}%`}
                icon={BarChart3}
              />
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Locations"
                value={totalLocations}
                icon={MapPin}
              />
              <StatCard
                title="Countries"
                value={countriesCount}
                icon={MapPin}
              />
              <StatCard
                title="Regions"
                value={regionsCount}
                icon={MapPin}
              />
              <StatCard
                title="Cities"
                value={citiesCount}
                icon={MapPin}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
