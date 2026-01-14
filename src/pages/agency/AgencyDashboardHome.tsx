import { useOutletContext, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  MapPin
} from "lucide-react";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

export default function AgencyDashboardHome() {
  const { agency, workspace, user } = useOutletContext<ContextType>();

  // Fetch leads
  const { data: leads } = useQuery({
    queryKey: ["agency-leads", agency?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("source_agency_id", agency?.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Fetch tasks
  const { data: tasks } = useQuery({
    queryKey: ["agency-tasks", workspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_tasks")
        .select("*")
        .eq("workspace_id", workspace?.id)
        .eq("status", "pending")
        .order("due_date", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!workspace?.id,
  });

  // Stats
  const newLeadsCount = leads?.filter(l => !l.is_viewed).length || 0;
  const totalLeadsCount = leads?.length || 0;
  const pendingTasksCount = tasks?.length || 0;
  const avgRating = agency?.rating || 0;
  const reviewsCount = agency?.review_count || 0;

  // Profile completeness
  const profileFields = [
    agency?.description,
    agency?.phone,
    agency?.email,
    agency?.website,
    agency?.logo_url,
    agency?.address,
  ];
  const profileCompleteness = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with your agency today.</p>
        </div>
        {!agency?.is_verified && (
          <Button className="rounded-full" asChild>
            <Link to="/agency/profile">
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Verification
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newLeadsCount}</p>
                <p className="text-sm text-muted-foreground">New Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-verified/10">
                <Users className="w-5 h-5 text-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLeadsCount}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">{reviewsCount} Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-warm/10">
                <CheckCircle className="w-5 h-5 text-warm" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTasksCount}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Leads</CardTitle>
                <CardDescription>Latest enquiries from potential foster carers</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" asChild>
                <Link to="/agency/leads">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <div
                  key={lead.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    !lead.is_viewed ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {lead.first_name} {lead.last_name}
                        </span>
                        {!lead.is_viewed && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No leads yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Completeness & Tasks */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-bold">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="h-2 rounded-full" />
                {profileCompleteness < 100 && (
                  <Button variant="outline" size="sm" className="w-full rounded-full mt-2" asChild>
                    <Link to="/agency/profile">
                      Complete Profile
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pending Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <Link to="/agency/tasks">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 3).map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'urgent' ? 'bg-destructive' :
                      task.priority === 'high' ? 'bg-warm' :
                      'bg-primary'
                    }`} />
                    <span className="flex-1 text-sm truncate">{task.title}</span>
                    {task.due_date && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 mx-auto text-verified mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
