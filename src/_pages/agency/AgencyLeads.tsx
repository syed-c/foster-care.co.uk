"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ArrowRight,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

const statusColors: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/25",
  contacted: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  qualified: "bg-verified/15 text-verified border-verified/25",
  converted: "bg-warm/15 text-warm border-warm/25",
  closed: "bg-muted text-muted-foreground border-border",
  spam: "bg-destructive/15 text-destructive border-destructive/25",
};

export default function AgencyLeads() {
  const { agency } = useOutletContext<ContextType>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads, isLoading } = useQuery({
    queryKey: ["agency-leads-full", agency?.id, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .eq("source_agency_id", agency?.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Mark as viewed mutation
  const markViewedMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from("leads")
        .update({ is_viewed: true, viewed_at: new Date().toISOString() })
        .eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency-leads-full"] });
      queryClient.invalidateQueries({ queryKey: ["unread-leads-count"] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency-leads-full"] });
      toast({ title: "Lead status updated" });
    },
  });

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    if (!lead.is_viewed) {
      markViewedMutation.mutate(lead.id);
    }
  };

  const filteredLeads = leads?.filter(lead => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      lead.first_name?.toLowerCase().includes(searchLower) ||
      lead.last_name?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.status === 'new').length || 0,
    contacted: leads?.filter(l => l.status === 'contacted').length || 0,
    converted: leads?.filter(l => l.status === 'converted').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads Inbox</h1>
          <p className="text-muted-foreground">Manage enquiries from potential foster carers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-soft">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.new}</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
              <Clock className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.contacted}</p>
                <p className="text-xs text-muted-foreground">Contacted</p>
              </div>
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-soft border-verified/20 bg-verified/5">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-verified">{stats.converted}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
              <CheckCircle className="w-5 h-5 text-verified" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredLeads && filteredLeads.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredLeads.map((lead: any) => (
                <div
                  key={lead.id}
                  onClick={() => handleLeadClick(lead)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
                    !lead.is_viewed ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {lead.first_name} {lead.last_name}
                        </span>
                        {!lead.is_viewed && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <Badge className={`text-[10px] rounded-full px-2 ${statusColors[lead.status]}`}>
                          {lead.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        {lead.postcode && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.postcode}
                          </span>
                        )}
                      </div>
                      {lead.message && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold mb-1">No leads found</h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter !== "all" 
                  ? "Try changing your filters" 
                  : "Enquiries will appear here when families contact you"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLead?.first_name} {selectedLead?.last_name}
              <Badge className={`text-xs rounded-full ${statusColors[selectedLead?.status]}`}>
                {selectedLead?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Enquiry received on {selectedLead && new Date(selectedLead.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <a href={`mailto:${selectedLead?.email}`} className="text-sm font-medium text-primary hover:underline">
                  {selectedLead?.email}
                </a>
              </div>
              {selectedLead?.phone && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <a href={`tel:${selectedLead?.phone}`} className="text-sm font-medium text-primary hover:underline">
                    {selectedLead?.phone}
                  </a>
                </div>
              )}
              {selectedLead?.postcode && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Postcode</p>
                  <p className="text-sm font-medium">{selectedLead?.postcode}</p>
                </div>
              )}
            </div>

            {selectedLead?.message && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Message</p>
                <p className="text-sm bg-muted p-3 rounded-xl">{selectedLead?.message}</p>
              </div>
            )}

            {selectedLead?.fostering_interest && selectedLead.fostering_interest.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.fostering_interest.map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="rounded-full">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-2">Update Status</p>
              <Select 
                value={selectedLead?.status} 
                onValueChange={(status) => {
                  updateStatusMutation.mutate({ leadId: selectedLead.id, status });
                  setSelectedLead({ ...selectedLead, status });
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-full" asChild>
                <a href={`mailto:${selectedLead?.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
              </Button>
              {selectedLead?.phone && (
                <Button variant="outline" className="flex-1 rounded-full" asChild>
                  <a href={`tel:${selectedLead?.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
