import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Search, 
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Globe,
  LayoutGrid,
  Loader2,
  Save,
  ExternalLink,
  GripVertical,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

// Page definitions
const STATIC_PAGES = [
  { key: "home", name: "Home", path: "/", category: "General" },
  { key: "about", name: "About", path: "/about", category: "General" },
  { key: "contact", name: "Contact", path: "/contact", category: "General" },
  { key: "agencies", name: "Agencies Listing", path: "/agencies", category: "General" },
  { key: "locations", name: "Locations Index", path: "/locations", category: "General" },
  { key: "specialisms", name: "Specialisms Index", path: "/specialisms", category: "General" },
  { key: "guides", name: "Guides Index", path: "/guides", category: "General" },
  { key: "blog", name: "Blog Index", path: "/blog", category: "General" },
  { key: "pricing", name: "Pricing", path: "/pricing", category: "General" },
];

// Block types
const BLOCK_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "text", label: "Text Block" },
  { value: "cta", label: "Call to Action" },
  { value: "features", label: "Features Grid" },
  { value: "testimonials", label: "Testimonials" },
  { value: "faq", label: "FAQ Section" },
  { value: "stats", label: "Stats Section" },
  { value: "image", label: "Image Block" },
];

export default function AdminCMS() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pages");
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  // Fetch content blocks
  const { data: contentBlocks, isLoading: blocksLoading } = useQuery({
    queryKey: ["admin-content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content_blocks")
        .select("*")
        .order("page_key")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Fetch locations for location pages
  const { data: locations } = useQuery({
    queryKey: ["admin-locations-cms"],
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

  // Save block mutation
  const saveBlockMutation = useMutation({
    mutationFn: async (block: any) => {
      if (block.id) {
        const { error } = await supabase
          .from("page_content_blocks")
          .update({
            title: block.title,
            content: block.content,
            block_type: block.block_type,
            metadata: block.metadata,
            is_active: block.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", block.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("page_content_blocks")
          .insert({
            page_key: block.page_key,
            block_key: block.block_key,
            block_type: block.block_type,
            title: block.title,
            content: block.content,
            metadata: block.metadata,
            display_order: block.display_order || 0,
            is_active: true,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-blocks"] });
      setEditingBlock(null);
      setIsAddingBlock(false);
      toast.success("Content block saved");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete block mutation
  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("page_content_blocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-blocks"] });
      toast.success("Content block deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Build location pages list
  const locationPages = (locations || []).map(loc => ({
    key: `location_${loc.slug}`,
    name: loc.name,
    path: `/locations/${loc.slug}`,
    category: loc.type === "country" ? "Countries" : loc.type === "region" ? "Regions" : "Cities",
    type: "location",
  }));

  // All pages combined
  const allPages = [
    ...STATIC_PAGES.map(p => ({ ...p, type: "static" })),
    ...locationPages,
  ];

  // Filter pages
  const filteredPages = allPages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group pages by category
  const pagesByCategory = filteredPages.reduce((acc, page) => {
    const cat = page.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {} as Record<string, typeof allPages>);

  // Get blocks for a page
  const getPageBlocks = (pageKey: string) => {
    return contentBlocks?.filter(b => b.page_key === pageKey) || [];
  };

  // Stats
  const totalPages = allPages.length;
  const totalBlocks = contentBlocks?.length || 0;
  const activeBlocks = contentBlocks?.filter(b => b.is_active).length || 0;

  return (
    <AdminLayout title="Content Management" description="Manage website pages and content blocks">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Pages"
            value={totalPages}
            icon={Globe}
          />
          <StatCard
            title="Content Blocks"
            value={totalBlocks}
            icon={LayoutGrid}
          />
          <StatCard
            title="Active Blocks"
            value={activeBlocks}
            icon={CheckCircle}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="pages" className="rounded-lg">Pages</TabsTrigger>
            <TabsTrigger value="blocks" className="rounded-lg">Content Blocks</TabsTrigger>
          </TabsList>

          {/* Pages Tab */}
          <TabsContent value="pages" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Website Pages
                    </CardTitle>
                    <CardDescription>Manage content for all pages</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>

                <div className="space-y-6">
                  {Object.entries(pagesByCategory).map(([category, pages]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        {category === "Countries" || category === "Regions" || category === "Cities" ? (
                          <MapPin className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                        {category}
                        <Badge variant="secondary" className="ml-2">{pages.length}</Badge>
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {pages.map((page) => {
                          const blocks = getPageBlocks(page.key);
                          return (
                            <div
                              key={page.key}
                              className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{page.name}</h4>
                                <Badge variant="outline" className="text-[10px]">
                                  {blocks.length} blocks
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground font-mono mb-3">{page.path}</p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 rounded-lg text-xs"
                                  onClick={() => setEditingPage(page.key)}
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg"
                                  asChild
                                >
                                  <a href={page.path} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocks Tab */}
          <TabsContent value="blocks" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5" />
                      Content Blocks
                    </CardTitle>
                    <CardDescription>Reusable content components</CardDescription>
                  </div>
                  <Button className="rounded-xl" onClick={() => setIsAddingBlock(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blocksLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contentBlocks?.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-muted">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{block.title || block.block_key}</p>
                            <Badge variant="outline" className="text-[10px]">{block.block_type}</Badge>
                            {!block.is_active && (
                              <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Page: {block.page_key} · Order: {block.display_order}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setEditingBlock(block)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive"
                            onClick={() => {
                              if (confirm("Delete this block?")) {
                                deleteBlockMutation.mutate(block.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!contentBlocks || contentBlocks.length === 0) && (
                      <div className="text-center py-12 text-muted-foreground">
                        No content blocks yet. Create your first block!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Page Editor Dialog */}
        <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Edit Page: {allPages.find(p => p.key === editingPage)?.name}
              </DialogTitle>
            </DialogHeader>
            {editingPage && (
              <PageBlocksEditor
                pageKey={editingPage}
                blocks={getPageBlocks(editingPage)}
                onSave={(block) => saveBlockMutation.mutate(block)}
                onDelete={(id) => deleteBlockMutation.mutate(id)}
                onClose={() => setEditingPage(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Block Editor Dialog */}
        <Dialog open={!!editingBlock || isAddingBlock} onOpenChange={(open) => {
          if (!open) {
            setEditingBlock(null);
            setIsAddingBlock(false);
          }
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingBlock ? "Edit Block" : "Add New Block"}</DialogTitle>
            </DialogHeader>
            <BlockEditor
              block={editingBlock}
              pages={allPages}
              onSave={(block) => saveBlockMutation.mutate(block)}
              onCancel={() => {
                setEditingBlock(null);
                setIsAddingBlock(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// Page Blocks Editor Component
function PageBlocksEditor({ 
  pageKey, 
  blocks, 
  onSave, 
  onDelete, 
  onClose 
}: {
  pageKey: string;
  blocks: any[];
  onSave: (block: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [editingBlock, setEditingBlock] = useState<any>(null);

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[60vh]">
        <div className="space-y-3 pr-4">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <div
                key={block.id}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{block.block_type}</Badge>
                    <span className="font-medium">{block.title || block.block_key}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingBlock(block)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Delete this block?")) onDelete(block.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {block.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{block.content}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No content blocks for this page yet.
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
          Close
        </Button>
        <Button 
          className="flex-1 rounded-xl"
          onClick={() => setEditingBlock({ page_key: pageKey, block_type: "text", block_key: "", title: "", content: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      </div>

      {/* Inline Block Editor */}
      <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBlock?.id ? "Edit Block" : "Add Block"}</DialogTitle>
          </DialogHeader>
          {editingBlock && (
            <BlockEditor
              block={editingBlock}
              onSave={(block) => {
                onSave(block);
                setEditingBlock(null);
              }}
              onCancel={() => setEditingBlock(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Block Editor Component
function BlockEditor({
  block,
  pages,
  onSave,
  onCancel,
}: {
  block?: any;
  pages?: any[];
  onSave: (block: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    page_key: block?.page_key || "",
    block_key: block?.block_key || "",
    block_type: block?.block_type || "text",
    title: block?.title || "",
    content: block?.content || "",
    is_active: block?.is_active ?? true,
    display_order: block?.display_order || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.page_key || !formData.block_key) {
      toast.error("Page and block key are required");
      return;
    }
    setIsSaving(true);
    onSave({ ...block, ...formData });
  };

  return (
    <div className="space-y-4">
      {pages && (
        <div className="space-y-2">
          <Label>Page</Label>
          <Select value={formData.page_key} onValueChange={(v) => setFormData({ ...formData, page_key: v })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent className="bg-card max-h-60">
              {pages.map((page) => (
                <SelectItem key={page.key} value={page.key}>{page.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Block Key</Label>
          <Input
            value={formData.block_key}
            onChange={(e) => setFormData({ ...formData, block_key: e.target.value })}
            placeholder="e.g., hero_main"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Block Type</Label>
          <Select value={formData.block_type} onValueChange={(v) => setFormData({ ...formData, block_type: v })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {BLOCK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Block title"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Block content (supports HTML)"
          rows={5}
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border">
          <Label className="cursor-pointer">Active</Label>
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Block
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
