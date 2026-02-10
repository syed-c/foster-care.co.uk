"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  MessageSquare,
  TrendingUp,
  Target,
  Filter,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  MoreHorizontal,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminLeadsIntelligence() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("leads");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Fetch leads with qualifications
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["admin-leads-intelligence"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          agencies:source_agency_id(name, slug),
          locations:source_location_id(name, slug),
          lead_qualifications(*)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch inquiry events
  const { data: inquiryEvents } = useQuery({
    queryKey: ["admin-inquiry-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiry_events")
        .select("*, agencies(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("leads")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads-intelligence"] });
      toast.success("Lead updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Stats
  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === "new").length || 0;
  const contactedLeads = leads?.filter(l => l.status === "contacted").length || 0;
  const convertedLeads = leads?.filter(l => l.status === "converted").length || 0;
  const highIntentLeads = leads?.filter(l => l.intent_depth === "high").length || 0;

  // Filter leads
  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch = 
      lead.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesIntent = intentFilter === "all" || lead.intent_depth === intentFilter;
    return matchesSearch && matchesStatus && matchesIntent;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge className="bg-primary/10 text-primary border-0"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case "contacted": return <Badge className="bg-warm/10 text-warm border-0"><MessageSquare className="w-3 h-3 mr-1" />Contacted</Badge>;
      case "in_progress": return <Badge className="bg-muted text-muted-foreground border-0">In Progress</Badge>;
      case "converted": return <Badge className="bg-verified/10 text-verified border-0"><CheckCircle className="w-3 h-3 mr-1" />Converted</Badge>;
      case "not_suitable": return <Badge className="bg-destructive/10 text-destructive border-0"><XCircle className="w-3 h-3 mr-1" />Not Suitable</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getIntentBadge = (intent: string | null) => {
    switch (intent) {
      case "high": return <Badge className="bg-verified/10 text-verified border-0">High Intent</Badge>;
      case "medium": return <Badge className="bg-warm/10 text-warm border-0">Medium Intent</Badge>;
      case "low": return <Badge className="bg-muted text-muted-foreground border-0">Low Intent</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getQualificationScore = (lead: any) => {
    const qual = lead.lead_qualifications?.[0];
    if (!qual) return 0;
    return qual.completion_percentage || 0;
  };

  return (
    <SuperAdminSidebar title="Lead Intelligence" description="Track and qualify leads across the platform">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
          />
          <StatCard
            title="New Leads"
            value={newLeads}
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Contacted"
            value={contactedLeads}
            icon={MessageSquare}
            variant="warm"
          />
          <StatCard
            title="Converted"
            value={convertedLeads}
            icon={CheckCircle}
            variant="verified"
          />
          <StatCard
            title="High Intent"
            value={highIntentLeads}
            icon={Target}
            variant="trust"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="leads" className="rounded-lg">All Leads</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg">Inquiry Events</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
          </TabsList>

          {/* All Leads Tab */}
          <TabsContent value="leads" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Lead Management
                </CardTitle>
                <CardDescription>View and manage all platform leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="not_suitable">Not Suitable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={intentFilter} onValueChange={setIntentFilter}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="Intent" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="all">All Intent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {leadsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Lead</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Intent</TableHead>
                          <TableHead>Qualification</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads?.slice(0, 50).map((lead: any) => (
                          <TableRow key={lead.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div>
                                <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {lead.agencies ? (
                                  <>
                                    <Building2 className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-sm">{lead.agencies.name}</span>
                                  </>
                                ) : lead.locations ? (
                                  <>
                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-sm">{lead.locations.name}</span>
                                  </>
                                ) : (
                                  <span className="text-sm text-muted-foreground">{lead.source_page || "Direct"}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(lead.status || "new")}</TableCell>
                            <TableCell>{getIntentBadge(lead.intent_depth)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={getQualificationScore(lead)} className="w-16 h-2" />
                                <span className="text-xs text-muted-foreground">
                                  {getQualificationScore(lead)}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(lead.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card">
                                  <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateLeadMutation.mutate({ 
                                    id: lead.id, 
                                    updates: { status: "contacted" } 
                                  })}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Mark Contacted
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateLeadMutation.mutate({ 
                                    id: lead.id, 
                                    updates: { status: "converted" } 
                                  })} className="text-verified">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Mark Converted
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!filteredLeads || filteredLeads.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                              No leads found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiry Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Inquiry Events
                </CardTitle>
                <CardDescription>Track all inquiry activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inquiryEvents?.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        event.event_type === "form_submit" ? "bg-primary/10" :
                        event.event_type === "call_intent" ? "bg-verified/10" :
                        "bg-warm/10"
                      }`}>
                        {event.event_type === "form_submit" && <MessageSquare className="w-4 h-4 text-primary" />}
                        {event.event_type === "call_intent" && <Phone className="w-4 h-4 text-verified" />}
                        {event.event_type === "chat_contact" && <Mail className="w-4 h-4 text-warm" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.agencies?.name || "Unknown Agency"}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.event_type.replace("_", " ")} · {event.source_page || "Direct"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                  ))}
                  {(!inquiryEvents || inquiryEvents.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">
                      No inquiry events recorded
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Leads</span>
                        <span className="font-bold">{totalLeads}</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Contacted</span>
                        <span className="font-bold">{contactedLeads} ({totalLeads > 0 ? Math.round(contactedLeads / totalLeads * 100) : 0}%)</span>
                      </div>
                      <Progress value={totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Converted</span>
                        <span className="font-bold text-verified">{convertedLeads} ({totalLeads > 0 ? Math.round(convertedLeads / totalLeads * 100) : 0}%)</span>
                      </div>
                      <Progress value={totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Intent Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-verified/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-verified" />
                        <span>High Intent</span>
                      </div>
                      <span className="font-bold">{highIntentLeads}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-warm/5">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-warm" />
                        <span>Medium Intent</span>
                      </div>
                      <span className="font-bold">{leads?.filter(l => l.intent_depth === "medium").length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        <span>Low Intent</span>
                      </div>
                      <span className="font-bold">{leads?.filter(l => l.intent_depth === "low").length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Lead Details Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedLead.first_name} {selectedLead.last_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    {getStatusBadge(selectedLead.status || "new")}
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Intent</p>
                    {getIntentBadge(selectedLead.intent_depth)}
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-medium">{selectedLead.phone || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Postcode</p>
                    <p className="text-sm font-medium">{selectedLead.postcode || "—"}</p>
                  </div>
                </div>

                {selectedLead.fostering_interest && selectedLead.fostering_interest.length > 0 && (
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-2">Fostering Interest</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.fostering_interest.map((interest: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLead.message && (
                  <div className="p-3 rounded-xl border">
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-sm">{selectedLead.message}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setSelectedLead(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      updateLeadMutation.mutate({ id: selectedLead.id, updates: { status: "contacted" } });
                      setSelectedLead(null);
                    }}
                  >
                    Mark Contacted
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminSidebar>
  );
}