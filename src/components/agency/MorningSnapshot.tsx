import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Moon, 
  MessageSquare, 
  Star, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface MorningSnapshotProps {
  agencyId: string;
  agencyName: string;
}

export function MorningSnapshot({ agencyId, agencyName }: MorningSnapshotProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const Icon = hour < 18 ? Sun : Moon;

  // Fetch today's stats
  const { data: todayStats } = useQuery({
    queryKey: ["morning-snapshot", agencyId],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const [leadsToday, newReviews, pendingTasks, unreadLeads] = await Promise.all([
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("source_agency_id", agencyId)
          .gte("created_at", todayISO),
        supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("agency_id", agencyId)
          .gte("created_at", todayISO),
        supabase
          .from("agency_tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("source_agency_id", agencyId)
          .eq("is_viewed", false),
      ]);

      return {
        leadsToday: leadsToday.count || 0,
        newReviews: newReviews.count || 0,
        pendingTasks: pendingTasks.count || 0,
        unreadLeads: unreadLeads.count || 0,
      };
    },
    enabled: !!agencyId,
    refetchInterval: 60000, // Refresh every minute
  });

  const stats = [
    {
      label: "New Leads Today",
      value: todayStats?.leadsToday || 0,
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Unread Enquiries",
      value: todayStats?.unreadLeads || 0,
      icon: AlertCircle,
      color: "text-warm",
      bgColor: "bg-warm/10",
      urgent: (todayStats?.unreadLeads || 0) > 0,
    },
    {
      label: "New Reviews",
      value: todayStats?.newReviews || 0,
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Pending Tasks",
      value: todayStats?.pendingTasks || 0,
      icon: CheckCircle,
      color: "text-verified",
      bgColor: "bg-verified/10",
    },
  ];

  return (
    <Card className="rounded-2xl border-border shadow-soft overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 via-warm/5 to-primary/5 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d")}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {greeting}, <span className="text-primary">{agencyName.split(' ')[0]}</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              Here's your morning snapshot
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-xl ${stat.bgColor} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background/80 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${stat.urgent ? 'text-warm' : ''}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(todayStats?.unreadLeads || 0) > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-warm/10 border border-warm/20 flex items-center gap-3">
            <Clock className="w-5 h-5 text-warm" />
            <p className="text-sm">
              <span className="font-medium text-warm">
                {todayStats?.unreadLeads} enquir{todayStats?.unreadLeads === 1 ? 'y' : 'ies'}
              </span>
              {" "}waiting for your response
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}