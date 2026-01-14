import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2, GripVertical, Heart, Save } from "lucide-react";

interface Specialism {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function AdminSpecialisms() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecialism, setEditingSpecialism] = useState<Specialism | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    seo_title: "",
    seo_description: "",
    is_active: true,
    display_order: 0,
  });
  const queryClient = useQueryClient();

  // Fetch specialisms
  const { data: specialisms, isLoading } = useQuery({
    queryKey: ["admin-specialisms"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("specialisms")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Specialism[];
    },
  });

  // Fetch agency counts per specialism
  const { data: specialismCounts } = useQuery({
    queryKey: ["admin-specialism-counts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("agency_specialisms")
        .select("specialism_id");
      if (error) return {};
      
      const counts: Record<string, number> = {};
      (data || []).forEach((item: any) => {
        counts[item.specialism_id] = (counts[item.specialism_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await (supabase as any)
          .from("specialisms")
          .update({
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            icon: data.icon || null,
            seo_title: data.seo_title || null,
            seo_description: data.seo_description || null,
            is_active: data.is_active,
            display_order: data.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("specialisms").insert({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          icon: data.icon || null,
          seo_title: data.seo_title || null,
          seo_description: data.seo_description || null,
          is_active: data.is_active,
          display_order: data.display_order,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialisms"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingSpecialism ? "Specialism updated" : "Specialism created");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save specialism");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("specialisms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specialisms"] });
      toast.success("Specialism deleted");
    },
    onError: () => toast.error("Failed to delete specialism"),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      seo_title: "",
      seo_description: "",
      is_active: true,
      display_order: (specialisms?.length || 0) + 1,
    });
    setEditingSpecialism(null);
  };

  const handleEdit = (specialism: Specialism) => {
    setEditingSpecialism(specialism);
    setFormData({
      name: specialism.name,
      slug: specialism.slug,
      description: specialism.description || "",
      icon: specialism.icon || "",
      seo_title: specialism.seo_title || "",
      seo_description: specialism.seo_description || "",
      is_active: specialism.is_active ?? true,
      display_order: specialism.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingSpecialism ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }
    saveMutation.mutate({
      ...formData,
      id: editingSpecialism?.id,
    });
  };

  const filteredSpecialisms = specialisms?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SuperAdminSidebar title="Specialisms" description="Manage fostering specialisms and categories">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Specialisms</CardTitle>
              <CardDescription>
                {specialisms?.length || 0} specialisms configured
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search specialisms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Specialism
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredSpecialisms && filteredSpecialisms.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Agencies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpecialisms.map((specialism) => (
                    <TableRow key={specialism.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{specialism.display_order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-primary" />
                          <span className="font-medium">{specialism.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {specialism.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {specialismCounts?.[specialism.id] || 0} agencies
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {specialism.is_active ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(specialism)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this specialism?")) {
                                deleteMutation.mutate(specialism.id);
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No specialisms found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first specialism
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSpecialism ? "Edit Specialism" : "Add Specialism"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Emergency & Short-Term"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., emergency-short-term"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this specialism..."
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., Heart, Home, Clock"
                />
                <p className="text-xs text-muted-foreground">
                  Lucide icon name (optional)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">SEO Settings</h4>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="Page title for search engines"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.seo_title.length}/60 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Meta description for search engines"
                    maxLength={160}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.seo_description.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">
                  Show this specialism on the website
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {editingSpecialism ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}
