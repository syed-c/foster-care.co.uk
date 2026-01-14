import { useState, useMemo } from "react";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, CheckCircle, Star, MapPin, Eye, 
  MoreHorizontal, Edit, Trash2, Shield, ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Agency = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  county: string | null;
  is_active: boolean | null;
  is_verified: boolean | null;
  is_featured: boolean | null;
  claim_status: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string | null;
};

export default function AdminAgenciesNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: agencies, isLoading, refetch } = useQuery({
    queryKey: ["admin-agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Agency[];
    },
  });

  const updateAgency = useMutation({
    mutationFn: async (updates: Partial<Agency> & { id: string }) => {
      const { error } = await supabase
        .from("agencies")
        .update(updates)
        .eq("id", updates.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agencies"] });
      toast({ title: "Agency updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error updating agency", description: error.message, variant: "destructive" });
    },
  });

  const deleteAgency = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agencies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agencies"] });
      toast({ title: "Agency deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting agency", description: error.message, variant: "destructive" });
    },
  });

  const filteredAgencies = useMemo(() => {
    if (!agencies) return [];
    return agencies.filter((agency) => {
      const matchesSearch = 
        agency.name.toLowerCase().includes(search.toLowerCase()) ||
        agency.city?.toLowerCase().includes(search.toLowerCase()) ||
        agency.county?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && agency.is_active) ||
        (statusFilter === "inactive" && !agency.is_active);
      const matchesVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" && agency.is_verified) ||
        (verifiedFilter === "unverified" && !agency.is_verified);
      return matchesSearch && matchesStatus && matchesVerified;
    });
  }, [agencies, search, statusFilter, verifiedFilter]);

  const columns = [
    {
      key: "name",
      header: "Agency",
      render: (agency: Agency) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{agency.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {agency.city || "No city"}{agency.county ? `, ${agency.county}` : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (agency: Agency) => (
        <div className="flex flex-wrap gap-1">
          {agency.is_verified && (
            <Badge className="bg-verified/10 text-verified border-verified/20 rounded-full text-xs gap-1">
              <Shield className="w-3 h-3" /> Verified
            </Badge>
          )}
          {agency.is_featured && (
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full text-xs gap-1">
              <Star className="w-3 h-3" /> Featured
            </Badge>
          )}
          {!agency.is_active && (
            <Badge variant="outline" className="rounded-full text-xs">Inactive</Badge>
          )}
          {agency.claim_status === "claimed" && (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full text-xs">Claimed</Badge>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (agency: Agency) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{agency.rating?.toFixed(1) || "—"}</span>
          <span className="text-xs text-muted-foreground">({agency.review_count || 0})</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      render: (agency: Agency) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl bg-popover">
            <DropdownMenuItem 
              onClick={() => window.open(`/agencies/${agency.slug}`, "_blank")}
              className="rounded-lg"
            >
              <Eye className="w-4 h-4 mr-2" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => { setEditingAgency(agency); setIsDialogOpen(true); }}
              className="rounded-lg"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateAgency.mutate({ id: agency.id, is_verified: !agency.is_verified })}
              className="rounded-lg"
            >
              <Shield className="w-4 h-4 mr-2" /> 
              {agency.is_verified ? "Remove Verification" : "Verify Agency"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateAgency.mutate({ id: agency.id, is_featured: !agency.is_featured })}
              className="rounded-lg"
            >
              <Star className="w-4 h-4 mr-2" /> 
              {agency.is_featured ? "Remove Featured" : "Make Featured"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => { if (confirm("Delete this agency?")) deleteAgency.mutate(agency.id); }}
              className="rounded-lg text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
    {
      key: "verified",
      label: "Verified",
      options: [
        { value: "all", label: "All Agencies" },
        { value: "verified", label: "Verified" },
        { value: "unverified", label: "Unverified" },
      ],
      value: verifiedFilter,
      onChange: setVerifiedFilter,
    },
  ];

  return (
    <SuperAdminSidebar title="Agencies" description="Manage all fostering agencies in the directory">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-2xl font-bold">{agencies?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Total Agencies</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-2xl font-bold text-verified">{agencies?.filter(a => a.is_verified).length || 0}</p>
          <p className="text-xs text-muted-foreground">Verified</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-2xl font-bold text-primary">{agencies?.filter(a => a.is_featured).length || 0}</p>
          <p className="text-xs text-muted-foreground">Featured</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-2xl font-bold text-amber-600">{agencies?.filter(a => a.claim_status === "claimed").length || 0}</p>
          <p className="text-xs text-muted-foreground">Claimed</p>
        </div>
      </div>

      <DataTable
        data={filteredAgencies}
        columns={columns}
        filters={filters}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search agencies..."
        onAdd={() => { setEditingAgency(null); setIsDialogOpen(true); }}
        addLabel="Add Agency"
        onRefresh={() => refetch()}
        isLoading={isLoading}
        rowKey={(agency) => agency.id}
        emptyState={
          <div className="text-center">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="font-medium">No agencies found</p>
            <p className="text-sm text-muted-foreground">Add your first agency to get started</p>
          </div>
        }
      />

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAgency ? "Edit Agency" : "Add New Agency"}</DialogTitle>
          </DialogHeader>
          <AgencyForm
            agency={editingAgency}
            onSubmit={(data) => {
              if (editingAgency) {
                updateAgency.mutate({ ...data, id: editingAgency.id });
              } else {
                // Create new agency logic would go here
              }
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}

function AgencyForm({ 
  agency, 
  onSubmit, 
  onCancel 
}: { 
  agency: Agency | null; 
  onSubmit: (data: Partial<Agency>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: agency?.name || "",
    slug: agency?.slug || "",
    city: agency?.city || "",
    county: agency?.county || "",
    is_active: agency?.is_active ?? true,
    is_verified: agency?.is_verified ?? false,
    is_featured: agency?.is_featured ?? false,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Agency Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Agency name"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="agency-slug"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>County</Label>
          <Input
            value={formData.county}
            onChange={(e) => setFormData({ ...formData, county: e.target.value })}
            placeholder="County"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <Label>Active</Label>
            <p className="text-xs text-muted-foreground">Agency is visible in directory</p>
          </div>
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Verified</Label>
            <p className="text-xs text-muted-foreground">Shows verified badge</p>
          </div>
          <Switch
            checked={formData.is_verified}
            onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured</Label>
            <p className="text-xs text-muted-foreground">Appears in featured sections</p>
          </div>
          <Switch
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
        <Button onClick={() => onSubmit(formData)} className="rounded-xl">Save Agency</Button>
      </div>
    </div>
  );
}
