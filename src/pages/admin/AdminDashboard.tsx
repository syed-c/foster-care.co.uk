import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users, MessageSquare, TrendingUp, Eye } from "lucide-react";
import { useAgencies } from "@/hooks/useAgencies";
import { useLocations } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: agencies } = useAgencies();
  const { data: locations } = useLocations();
  
  const { data: leads } = useQuery({
    queryKey: ["admin-leads-count"],
    queryFn: async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: newLeads } = useQuery({
    queryKey: ["admin-new-leads"],
    queryFn: async () => {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      return count || 0;
    },
  });

  const stats = [
    { name: "Total Agencies", value: agencies?.length || 0, icon: Building2, change: "+12%" },
    { name: "Locations", value: locations?.length || 0, icon: MapPin, change: "+3" },
    { name: "Total Leads", value: leads || 0, icon: MessageSquare, change: "+24%" },
    { name: "New Leads", value: newLeads || 0, icon: Eye, color: "text-primary" },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of your platform">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card className="bg-[#1a2228] text-white hover:bg-card hover:text-foreground transition-colors duration-300" key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className={`text-3xl font-semibold mt-1 ${stat.color || ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
              {stat.change && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                  {stat.change} this month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-secondary/10">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Lead management coming soon. View and manage all enquiries from potential foster carers.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">
              • Add new agency<br />
              • Manage locations<br />
              • Update FAQs<br />
              • Edit page content
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
