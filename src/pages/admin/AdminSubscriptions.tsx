import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, 
  Search, 
  MoreHorizontal,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Pencil,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminSubscriptions() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // Fetch subscriptions with agency and plan details
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_subscriptions")
        .select(`
          *,
          agencies(id, name, slug, logo_url, is_verified),
          pricing_plans(id, name, slug, price_monthly)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch plans for filtering
  const { data: plans } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Update subscription status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from("agency_subscriptions")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast.success("Subscription status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Stats
  const activeCount = subscriptions?.filter(s => s.status === "active").length || 0;
  const trialCount = subscriptions?.filter(s => s.status === "trialing").length || 0;
  const cancelledCount = subscriptions?.filter(s => s.status === "cancelled").length || 0;
  const monthlyRevenue = subscriptions
    ?.filter(s => s.status === "active")
    .reduce((sum, s) => sum + ((s.pricing_plans as any)?.price_monthly || 0), 0) || 0;

  // Filter subscriptions
  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const agency = sub.agencies as any;
    const plan = sub.pricing_plans as any;
    const matchesSearch = 
      agency?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || plan?.slug === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-verified/10 text-verified border-0"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case "trialing":
        return <Badge className="bg-primary/10 text-primary border-0"><Clock className="w-3 h-3 mr-1" /> Trial</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive border-0"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      case "past_due":
        return <Badge className="bg-warm/10 text-warm border-0"><AlertTriangle className="w-3 h-3 mr-1" /> Past Due</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Subscriptions" description="Manage agency subscriptions and billing">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Subscriptions"
            value={activeCount}
            icon={CheckCircle}
            trend={activeCount > 0 ? { value: 12, label: "vs last month" } : undefined}
            variant="verified"
          />
          <StatCard
            title="In Trial"
            value={trialCount}
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Cancelled"
            value={cancelledCount}
            icon={XCircle}
          />
          <StatCard
            title="Monthly Revenue"
            value={`£${monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={monthlyRevenue > 0 ? { value: 8, label: "vs last month" } : undefined}
            variant="warm"
          />
        </div>

        {/* Filters */}
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by agency or plan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trialing">Trial</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.slug}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscriptions
            </CardTitle>
            <CardDescription>
              {filteredSubscriptions?.length || 0} total subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Agency</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Period End</TableHead>
                      <TableHead>Monthly</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions?.map((sub) => {
                      const agency = sub.agencies as any;
                      const plan = sub.pricing_plans as any;
                      return (
                        <TableRow key={sub.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {agency?.logo_url ? (
                                <img
                                  src={agency.logo_url}
                                  alt={agency.name}
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{agency?.name}</p>
                                {agency?.is_verified && (
                                  <Badge variant="secondary" className="text-[10px]">Verified</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{plan?.name}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {sub.current_period_end 
                              ? format(new Date(sub.current_period_end), "MMM d, yyyy")
                              : "—"}
                          </TableCell>
                          <TableCell className="font-medium">
                            £{plan?.price_monthly || 0}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card">
                                <DropdownMenuItem onClick={() => setSelectedSubscription(sub)}>
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                {sub.status === "active" && (
                                  <DropdownMenuItem 
                                    onClick={() => updateStatusMutation.mutate({ id: sub.id, status: "cancelled" })}
                                    className="text-destructive"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" /> Cancel
                                  </DropdownMenuItem>
                                )}
                                {sub.status === "cancelled" && (
                                  <DropdownMenuItem 
                                    onClick={() => updateStatusMutation.mutate({ id: sub.id, status: "active" })}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" /> Reactivate
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(!filteredSubscriptions || filteredSubscriptions.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Details Dialog */}
        <Dialog open={!!selectedSubscription} onOpenChange={(open) => !open && setSelectedSubscription(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{(selectedSubscription.agencies as any)?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedSubscription.pricing_plans as any)?.name} Plan
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    {getStatusBadge(selectedSubscription.status)}
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Price</p>
                    <p className="font-bold">£{(selectedSubscription.pricing_plans as any)?.price_monthly}</p>
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Period Start</p>
                    <p className="text-sm">
                      {selectedSubscription.current_period_start 
                        ? format(new Date(selectedSubscription.current_period_start), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Period End</p>
                    <p className="text-sm">
                      {selectedSubscription.current_period_end 
                        ? format(new Date(selectedSubscription.current_period_end), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setSelectedSubscription(null)}
                  >
                    Close
                  </Button>
                  {selectedSubscription.status === "active" && (
                    <Button 
                      variant="destructive" 
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        updateStatusMutation.mutate({ id: selectedSubscription.id, status: "cancelled" });
                        setSelectedSubscription(null);
                      }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
