import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Settings2, 
  Pin,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Loader2,
  Save,
  RefreshCw,
  Shield,
  Star,
  Clock,
  FileText,
  Zap
} from "lucide-react";
import { toast } from "sonner";

// Ranking factor definitions
const RANKING_FACTORS = [
  { key: "verification_status", label: "Verification Status", description: "Verified agencies rank higher", icon: Shield },
  { key: "profile_completeness", label: "Profile Completeness", description: "Complete profiles rank higher", icon: FileText },
  { key: "response_time", label: "Response Time", description: "Fast responders rank higher", icon: Clock },
  { key: "reputation_trend", label: "Reputation Trend", description: "Improving reputation ranks higher", icon: TrendingUp },
  { key: "recent_activity", label: "Recent Activity", description: "Active agencies rank higher", icon: Zap },
  { key: "plan_tier", label: "Plan Tier", description: "Higher plans rank higher", icon: Star },
  { key: "admin_trust_score", label: "Admin Trust Score", description: "Manual trust rating", icon: Trophy },
  { key: "content_freshness", label: "Content Freshness", description: "Updated content ranks higher", icon: RefreshCw },
];

interface RankingRule {
  id: string;
  scope_type: string;
  scope_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
  factors: any;
}

interface RankingOverride {
  id: string;
  agency_id: string;
  scope_type: string;
  scope_id: string | null;
  override_type: string;
  position: number | null;
  boost_value: number;
  reason: string | null;
  expires_at: string | null;
  agencies?: { name: string; slug: string };
}

export default function AdminRanking() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("rules");
  const [editingRule, setEditingRule] = useState<RankingRule | null>(null);
  const [addingOverride, setAddingOverride] = useState(false);
  const [previewScope, setPreviewScope] = useState<string>("global");

  // Fetch ranking rules
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["ranking-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_ranking_rules")
        .select("*")
        .order("scope_type");
      if (error) throw error;
      return data as RankingRule[];
    },
  });

  // Fetch ranking overrides
  const { data: overrides, isLoading: overridesLoading } = useQuery({
    queryKey: ["ranking-overrides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_ranking_overrides")
        .select("*, agencies(name, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as RankingOverride[];
    },
  });

  // Fetch agencies for overrides
  const { data: agencies } = useQuery({
    queryKey: ["agencies-for-ranking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id, name, slug, is_verified")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch locations for scopes
  const { data: locations } = useQuery({
    queryKey: ["locations-for-ranking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, slug, type")
        .eq("is_active", true)
        .order("type")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Update rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: async (rule: RankingRule) => {
      const { error } = await supabase
        .from("agency_ranking_rules")
        .update({
          name: rule.name,
          description: rule.description,
          is_active: rule.is_active,
          factors: rule.factors,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rule.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ranking-rules"] });
      setEditingRule(null);
      toast.success("Ranking rule updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Add override mutation
  const addOverrideMutation = useMutation({
    mutationFn: async (override: any) => {
      const { error } = await supabase
        .from("agency_ranking_overrides")
        .insert([override]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ranking-overrides"] });
      setAddingOverride(false);
      toast.success("Override added");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete override mutation
  const deleteOverrideMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agency_ranking_overrides")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ranking-overrides"] });
      toast.success("Override removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Stats
  const activeRules = rules?.filter(r => r.is_active).length || 0;
  const totalOverrides = overrides?.length || 0;
  const pinnedAgencies = overrides?.filter(o => o.override_type === "pin").length || 0;
  const excludedAgencies = overrides?.filter(o => o.override_type === "exclude").length || 0;

  const getOverrideIcon = (type: string) => {
    switch (type) {
      case "pin": return <Pin className="w-4 h-4" />;
      case "boost": return <TrendingUp className="w-4 h-4 text-verified" />;
      case "suppress": return <TrendingDown className="w-4 h-4 text-warm" />;
      case "exclude": return <EyeOff className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getOverrideBadge = (type: string) => {
    switch (type) {
      case "pin": return <Badge className="bg-primary/10 text-primary border-0">Pinned</Badge>;
      case "boost": return <Badge className="bg-verified/10 text-verified border-0">Boosted</Badge>;
      case "suppress": return <Badge className="bg-warm/10 text-warm border-0">Suppressed</Badge>;
      case "exclude": return <Badge className="bg-destructive/10 text-destructive border-0">Excluded</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <AdminLayout title="Ranking Control" description="Control how agencies are ranked and displayed">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Rules"
            value={activeRules}
            icon={Settings2}
            variant="primary"
          />
          <StatCard
            title="Total Overrides"
            value={totalOverrides}
            icon={Trophy}
          />
          <StatCard
            title="Pinned Agencies"
            value={pinnedAgencies}
            icon={Pin}
            variant="verified"
          />
          <StatCard
            title="Excluded Agencies"
            value={excludedAgencies}
            icon={EyeOff}
            variant="warm"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="rules" className="rounded-lg">Ranking Rules</TabsTrigger>
            <TabsTrigger value="overrides" className="rounded-lg">Manual Overrides</TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg">Preview Rankings</TabsTrigger>
          </TabsList>

          {/* Ranking Rules Tab */}
          <TabsContent value="rules" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  Ranking Logic Rules
                </CardTitle>
                <CardDescription>
                  Configure which factors determine agency rankings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules?.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{rule.name}</h3>
                              <Badge variant="outline" className="text-[10px]">
                                {rule.scope_type}
                              </Badge>
                              {rule.is_active ? (
                                <Badge className="bg-verified/10 text-verified border-0 text-[10px]">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rule.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(rule.factors as Record<string, { enabled: boolean; weight: number }>).map(([key, factor]) => (
                                factor.enabled && (
                                  <Badge key={key} variant="secondary" className="text-[10px]">
                                    {RANKING_FACTORS.find(f => f.key === key)?.label || key}: {factor.weight}%
                                  </Badge>
                                )
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!rules || rules.length === 0) && (
                      <div className="text-center py-12 text-muted-foreground">
                        No ranking rules configured
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Overrides Tab */}
          <TabsContent value="overrides" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Manual Overrides
                    </CardTitle>
                    <CardDescription>
                      Pin, boost, suppress, or exclude specific agencies
                    </CardDescription>
                  </div>
                  <Button className="rounded-xl" onClick={() => setAddingOverride(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Override
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {overridesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Agency</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overrides?.map((override) => (
                          <TableRow key={override.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-muted">
                                  <Building2 className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">
                                  {override.agencies?.name || "Unknown"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getOverrideIcon(override.override_type)}
                                {getOverrideBadge(override.override_type)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {override.scope_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {override.override_type === "pin" && override.position && (
                                <span className="font-bold">#{override.position}</span>
                              )}
                              {(override.override_type === "boost" || override.override_type === "suppress") && (
                                <span className={override.boost_value > 0 ? "text-verified" : "text-warm"}>
                                  {override.boost_value > 0 ? "+" : ""}{override.boost_value}
                                </span>
                              )}
                              {override.override_type === "exclude" && "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                              {override.reason || "—"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  if (confirm("Remove this override?")) {
                                    deleteOverrideMutation.mutate(override.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!overrides || overrides.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                              No overrides configured
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

          {/* Preview Tab */}
          <TabsContent value="preview" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Ranking Preview
                    </CardTitle>
                    <CardDescription>
                      Preview how agencies will be ranked
                    </CardDescription>
                  </div>
                  <Select value={previewScope} onValueChange={setPreviewScope}>
                    <SelectTrigger className="w-[200px] rounded-xl">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="global">Global</SelectItem>
                      {locations?.filter(l => l.type === "country").map(loc => (
                        <SelectItem key={loc.id} value={`country:${loc.id}`}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a scope to preview rankings</p>
                  <p className="text-sm mt-2">Rankings are calculated based on active rules and overrides</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Rule Dialog */}
        <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Configure Ranking Rule</DialogTitle>
              <DialogDescription>
                Adjust factor weights to control ranking priority
              </DialogDescription>
            </DialogHeader>
            {editingRule && (
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-6 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Rule Name</Label>
                      <Input
                        value={editingRule.name}
                        onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Active</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Switch
                          checked={editingRule.is_active}
                          onCheckedChange={(checked) => setEditingRule({ ...editingRule, is_active: checked })}
                        />
                        <span className="text-sm text-muted-foreground">
                          {editingRule.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Ranking Factors</Label>
                    {RANKING_FACTORS.map((factor) => {
                      const factorData = (editingRule.factors as Record<string, { enabled: boolean; weight: number }>)[factor.key] || { enabled: false, weight: 10 };
                      return (
                        <div key={factor.key} className="p-4 rounded-xl border">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <factor.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium">{factor.label}</p>
                                <p className="text-xs text-muted-foreground">{factor.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={factorData.enabled}
                              onCheckedChange={(checked) => {
                                const newFactors = { ...editingRule.factors as Record<string, { enabled: boolean; weight: number }> };
                                newFactors[factor.key] = { ...factorData, enabled: checked };
                                setEditingRule({ ...editingRule, factors: newFactors });
                              }}
                            />
                          </div>
                          {factorData.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Weight</span>
                                <span className="font-bold">{factorData.weight}%</span>
                              </div>
                              <Slider
                                value={[factorData.weight]}
                                onValueChange={([value]) => {
                                  const newFactors = { ...editingRule.factors as Record<string, { enabled: boolean; weight: number }> };
                                  newFactors[factor.key] = { ...factorData, weight: value };
                                  setEditingRule({ ...editingRule, factors: newFactors });
                                }}
                                max={100}
                                step={5}
                                className="py-2"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            )}
            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" onClick={() => setEditingRule(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => editingRule && updateRuleMutation.mutate(editingRule)}
                disabled={updateRuleMutation.isPending}
                className="rounded-xl"
              >
                {updateRuleMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Override Dialog */}
        <AddOverrideDialog
          open={addingOverride}
          onOpenChange={setAddingOverride}
          agencies={agencies || []}
          locations={locations || []}
          onSubmit={(override) => addOverrideMutation.mutate(override)}
          isLoading={addOverrideMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
}

// Add Override Dialog Component
function AddOverrideDialog({
  open,
  onOpenChange,
  agencies,
  locations,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencies: any[];
  locations: any[];
  onSubmit: (override: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    agency_id: "",
    scope_type: "global",
    scope_id: null as string | null,
    override_type: "pin",
    position: 1,
    boost_value: 10,
    reason: "",
  });

  const handleSubmit = () => {
    if (!formData.agency_id) {
      toast.error("Please select an agency");
      return;
    }

    onSubmit({
      agency_id: formData.agency_id,
      scope_type: formData.scope_type,
      scope_id: formData.scope_type === "global" ? null : formData.scope_id,
      override_type: formData.override_type,
      position: formData.override_type === "pin" ? formData.position : null,
      boost_value: ["boost", "suppress"].includes(formData.override_type) 
        ? (formData.override_type === "suppress" ? -Math.abs(formData.boost_value) : formData.boost_value)
        : 0,
      reason: formData.reason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Ranking Override</DialogTitle>
          <DialogDescription>
            Manually control an agency's ranking position
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Agency</Label>
            <Select value={formData.agency_id} onValueChange={(v) => setFormData({ ...formData, agency_id: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select agency" />
              </SelectTrigger>
              <SelectContent className="bg-card max-h-[200px]">
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Override Type</Label>
            <Select value={formData.override_type} onValueChange={(v) => setFormData({ ...formData, override_type: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="pin">Pin to Position</SelectItem>
                <SelectItem value="boost">Boost Ranking</SelectItem>
                <SelectItem value="suppress">Suppress Ranking</SelectItem>
                <SelectItem value="exclude">Exclude from Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={formData.scope_type} onValueChange={(v) => setFormData({ ...formData, scope_type: v, scope_id: null })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.scope_type !== "global" && (
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={formData.scope_id || ""} onValueChange={(v) => setFormData({ ...formData, scope_id: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-card max-h-[200px]">
                    {locations
                      .filter(l => l.type === formData.scope_type)
                      .map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {formData.override_type === "pin" && (
            <div className="space-y-2">
              <Label>Position (1-10)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
                className="rounded-xl"
              />
            </div>
          )}

          {["boost", "suppress"].includes(formData.override_type) && (
            <div className="space-y-2">
              <Label>Boost Value</Label>
              <Slider
                value={[formData.boost_value]}
                onValueChange={([v]) => setFormData({ ...formData, boost_value: v })}
                max={50}
                step={5}
              />
              <p className="text-sm text-muted-foreground text-center">
                {formData.override_type === "suppress" ? "-" : "+"}{formData.boost_value} points
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Input
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Why is this override needed?"
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="rounded-xl">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}