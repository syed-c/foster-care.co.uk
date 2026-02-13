"use client";
import { useState, useEffect, useCallback } from "react";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
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
  Pencil,
  Trash2,
  Globe,
  LayoutGrid,
  Loader2,
  Save,
  ExternalLink,
  GripVertical,
  CheckCircle,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// ─── Page definitions ────────────────────────────────────────────────
const STATIC_PAGES = [
  { key: "home", name: "Home", path: "/", category: "General" },
  { key: "become-a-foster", name: "Become a Foster", path: "/become-a-foster", category: "Core" },
  { key: "about", name: "About", path: "/about", category: "General" },
  { key: "contact", name: "Contact", path: "/contact", category: "General" },
  { key: "agencies", name: "Agencies Listing", path: "/agencies", category: "Browse" },
  { key: "locations", name: "Locations Index", path: "/locations", category: "Browse" },
  { key: "specialisms", name: "Specialisms Index", path: "/specialisms", category: "Browse" },
  { key: "guides", name: "Guides Index", path: "/guides", category: "Resources" },
  { key: "blog", name: "Blog Index", path: "/blog", category: "Resources" },
  { key: "pricing", name: "Pricing", path: "/pricing", category: "General" },
  { key: "policy-funding", name: "Funding Policy", path: "/policy/funding", category: "Policy" },
  { key: "policy-training", name: "Training Policy", path: "/policy/training", category: "Policy" },
  { key: "policy-support", name: "Support Policy", path: "/policy/support", category: "Policy" },
  { key: "policy-process", name: "Process Policy", path: "/policy/process", category: "Policy" },
  { key: "policy-requirements", name: "Requirements Policy", path: "/policy/requirements", category: "Policy" },
];

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

// ─── API helpers ─────────────────────────────────────────────────────
async function apiGet(params: Record<string, string>) {
  const url = new URL("/api/admin/cms", window.location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

async function apiPost(body: Record<string, any>) {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ─── Main AdminCMS component ────────────────────────────────────────
export default function AdminCMS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pages");
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [pageSubTab, setPageSubTab] = useState("Static");

  // Data state
  const [locations, setLocations] = useState<any[]>([]);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from server API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiGet({});
      setLocations(result.locations || []);
      setContentBlocks(result.blocks || []);
    } catch (err: any) {
      setError(err.message);
      console.error("CMS data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build location pages list
  const locationPages = locations.map((loc: any) => ({
    key: `loc_${loc.slug}`,
    name: loc.name,
    path: `/locations/${loc.slug}`,
    category: loc.type === "country" ? "Countries" : loc.type === "region" ? "Regions" : loc.type === "county" ? "Counties" : "Cities",
    type: "location",
    locationType: loc.type,
  }));

  // All pages combined
  const allPages = [
    ...STATIC_PAGES.map(p => ({ ...p, type: "static", locationType: "static" })),
    ...locationPages,
  ];

  // Group pages by category
  const categoryMap = {
    "Static": allPages.filter(p => p.type === "static"),
    "Countries": allPages.filter(p => p.category === "Countries"),
    "Regions": allPages.filter(p => p.category === "Regions"),
    "Counties": allPages.filter(p => p.category === "Counties"),
    "Cities": allPages.filter(p => p.category === "Cities"),
  };

  // Get blocks for a page
  const getPageBlocks = (pageKey: string) => {
    return contentBlocks.filter((b: any) => b.page_key === pageKey);
  };

  // Stats
  const totalPages = allPages.length;
  const totalBlocks = contentBlocks.length;
  const activeBlocks = contentBlocks.filter((b: any) => b.is_active).length;

  // Save block handler
  const handleSaveBlock = async (block: any) => {
    try {
      await apiPost({ action: "save_block", block });
      toast.success("Content block saved!");
      await fetchData();
      setEditingBlock(null);
      setIsAddingBlock(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Delete block handler
  const handleDeleteBlock = async (id: string) => {
    try {
      await apiPost({ action: "delete_block", id });
      toast.success("Block deleted");
      await fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminSidebar title="Content Management" description="Manage website pages and content blocks">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading CMS data...</span>
        </div>
      </SuperAdminSidebar>
    );
  }

  if (error) {
    return (
      <SuperAdminSidebar title="Content Management" description="Manage website pages and content blocks">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={fetchData} variant="outline">Retry</Button>
        </div>
      </SuperAdminSidebar>
    );
  }

  return (
    <SuperAdminSidebar title="Content Management" description="Manage website pages and content blocks">
      <div className="space-y-6 pb-20 relative min-h-full">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Pages" value={totalPages} icon={Globe} />
          <StatCard title="Content Blocks" value={totalBlocks} icon={LayoutGrid} />
          <StatCard title="Active Blocks" value={activeBlocks} icon={CheckCircle} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="pages" className="rounded-lg">Pages</TabsTrigger>
            <TabsTrigger value="blocks" className="rounded-lg">All Content Blocks</TabsTrigger>
          </TabsList>

          {/* ── Pages Tab ────────────────────────────────────────── */}
          <TabsContent value="pages" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Website Pages
                    </CardTitle>
                    <CardDescription>Click Edit to manage content blocks for any page</CardDescription>
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

                <Tabs value={pageSubTab} onValueChange={setPageSubTab} className="mb-6">
                  <TabsList className="bg-muted/30 p-1 flex-wrap h-auto">
                    {Object.keys(categoryMap).map(cat => (
                      <TabsTrigger key={cat} value={cat} className="px-4 py-2 rounded-lg text-xs">
                        {cat}
                        <Badge variant="outline" className="ml-1.5 h-4 px-1 min-w-[1.25rem] text-[10px] bg-muted-foreground/10 border-none">
                          {categoryMap[cat as keyof typeof categoryMap].length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryMap[pageSubTab as keyof typeof categoryMap]
                    .filter(page =>
                      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      page.path.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((page) => {
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

                {categoryMap[pageSubTab as keyof typeof categoryMap].length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No pages found in this category.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── All Blocks Tab ───────────────────────────────────── */}
          <TabsContent value="blocks" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5" />
                      All Content Blocks
                    </CardTitle>
                    <CardDescription>View and manage all content blocks across all pages</CardDescription>
                  </div>
                  <Button className="rounded-xl" onClick={() => setIsAddingBlock(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {contentBlocks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No content blocks yet</p>
                    <p className="text-sm mt-1">Open any page and click Edit to auto-create blocks, or add one manually.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contentBlocks.map((block: any) => (
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
                            Page: {block.page_key} · Key: {block.block_key} · Order: {block.display_order}
                          </p>
                          {block.content && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{block.content}</p>
                          )}
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
                                handleDeleteBlock(block.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Page Editor Dialog ───────────────────────────────── */}
        <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Edit Page: {allPages.find(p => p.key === editingPage)?.name}
              </DialogTitle>
            </DialogHeader>
            {editingPage && (
              <PageManagementDialog
                page={allPages.find(p => p.key === editingPage) || { key: editingPage, name: "Unknown Page", locationType: "static" }}
                onClose={() => setEditingPage(null)}
                onDataChanged={fetchData}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* ── Block Editor Dialog (from All Blocks tab) ────────── */}
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
              onSave={handleSaveBlock}
              onCancel={() => {
                setEditingBlock(null);
                setIsAddingBlock(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminSidebar>
  );
}

// ─── Page Management Dialog ──────────────────────────────────────────
function PageManagementDialog({
  page,
  onClose,
  onDataChanged,
}: {
  page: any;
  onClose: () => void;
  onDataChanged: () => Promise<void>;
}) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  const fetchPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [blocksRes, faqsRes] = await Promise.all([
        apiGet({ action: "blocks", page_key: page.key }),
        apiGet({ action: "faqs", page_key: page.key }),
      ]);
      setBlocks(blocksRes.data || []);
      setFaqs(faqsRes.data || []);
    } catch (err: any) {
      toast.error("Failed to load page data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page.key]);

  useEffect(() => { fetchPageData(); }, [fetchPageData]);

  const handleSeedBlocks = async () => {
    setIsSeeding(true);
    try {
      const result = await apiPost({
        action: "seed_blocks",
        page_key: page.key,
        page_type: page.locationType || "static",
      });
      if (result.seeded > 0) {
        toast.success(`Created ${result.seeded} default content blocks`);
        await fetchPageData();
        await onDataChanged();
      } else {
        toast.info("All default blocks already exist for this page");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSaveBlock = async (block: any) => {
    try {
      await apiPost({ action: "save_block", block });
      toast.success("Block saved!");
      await fetchPageData();
      await onDataChanged();
      setEditingBlock(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await apiPost({ action: "delete_block", id });
      toast.success("Block deleted");
      await fetchPageData();
      await onDataChanged();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSaveFaq = async (faq: any) => {
    try {
      await apiPost({ action: "save_faq", faq });
      toast.success("FAQ saved!");
      await fetchPageData();
      setEditingFaq(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await apiPost({ action: "delete_faq", id });
      toast.success("FAQ deleted");
      await fetchPageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-xl mb-6">
        <TabsTrigger value="content" className="rounded-lg">Content Blocks</TabsTrigger>
        <TabsTrigger value="faqs" className="rounded-lg">FAQs</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <div className="space-y-4">
          {/* Seed default blocks button */}
          {blocks.length === 0 && !isLoading && (
            <div className="p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-center">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h4 className="font-bold text-lg mb-1">No content blocks yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Auto-create default content blocks for this page to start editing
              </p>
              <Button onClick={handleSeedBlocks} disabled={isSeeding} className="rounded-xl">
                {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Default Blocks
              </Button>
            </div>
          )}

          <ScrollArea className="h-[50vh]">
            <div className="space-y-3 pr-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : blocks.length > 0 ? (
                blocks.map((block: any) => (
                  <div key={block.id} className="p-4 rounded-xl border bg-card flex justify-between items-start">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{block.block_type}</Badge>
                        <span className="font-medium">{block.title || block.block_key}</span>
                        {!block.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{block.block_key}</p>
                      {block.content && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{block.content}</p>}
                      {!block.content && <p className="text-sm text-amber-500 italic mt-1">Empty — click edit to add content</p>}
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setEditingBlock(block)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirm("Delete this block?") && handleDeleteBlock(block.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </ScrollArea>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Close</Button>
            {blocks.length > 0 && (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={handleSeedBlocks}
                disabled={isSeeding}
              >
                {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Add Missing Blocks
              </Button>
            )}
            <Button
              className="flex-1 rounded-xl"
              onClick={() => setEditingBlock({ page_key: page.key, block_type: "text", block_key: "", title: "", content: "", metadata: {}, is_active: true, display_order: (blocks.length + 1) * 10 })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Custom Block
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="faqs">
        <div className="space-y-4">
          <ScrollArea className="h-[50vh]">
            <div className="space-y-3 pr-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : faqs.length > 0 ? (
                faqs.map((faq: any) => (
                  <div key={faq.id} className="p-4 rounded-xl border bg-card flex justify-between items-start">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{faq.question}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setEditingFaq(faq)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => confirm("Delete this FAQ?") && handleDeleteFaq(faq.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No FAQs yet for this page.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Close</Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={() => setEditingFaq({ page_key: page.key, question: "", answer: "", is_active: true, display_order: (faqs.length + 1) * 10 })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Block Editor sub-dialog */}
      <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingBlock?.id ? "Edit Block" : "Add Block"}</DialogTitle></DialogHeader>
          {editingBlock && (
            <BlockEditor
              block={editingBlock}
              onSave={handleSaveBlock}
              onCancel={() => setEditingBlock(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Editor sub-dialog */}
      <Dialog open={!!editingFaq} onOpenChange={(open) => !open && setEditingFaq(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingFaq?.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          {editingFaq && (
            <FaqEditor
              faq={editingFaq}
              onSave={handleSaveFaq}
              onCancel={() => setEditingFaq(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

// ─── FAQ Editor ──────────────────────────────────────────────────────
function FaqEditor({
  faq,
  onSave,
  onCancel,
}: {
  faq: any;
  onSave: (faq: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    question: faq?.question || "",
    answer: faq?.answer || "",
    is_active: faq?.is_active ?? true,
    display_order: faq?.display_order || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!formData.question || !formData.answer) {
      toast.error("Question and answer are required");
      return;
    }
    setIsSaving(true);
    onSave({ ...faq, ...formData });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter the FAQ question..."
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          placeholder="Enter the FAQ answer..."
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
        <div className="flex items-center gap-2 pt-6">
          <Switch
            id="faq-active"
            checked={formData.is_active}
            onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
          />
          <Label htmlFor="faq-active">Active</Label>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {faq?.id ? "Update FAQ" : "Create FAQ"}
        </Button>
      </div>
    </div>
  );
}

// ─── Block Editor ────────────────────────────────────────────────────
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
    metadata: block?.metadata || {},
    is_active: block?.is_active ?? true,
    display_order: block?.display_order || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!formData.page_key || !formData.block_key) {
      toast.error("Page key and block key are required");
      return;
    }
    setIsSaving(true);
    onSave({ ...block, ...formData });
  };

  const updateMetadata = (key: string, value: string) => {
    setFormData({
      ...formData,
      metadata: {
        ...(formData.metadata as Record<string, any>),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {pages && (
        <div className="space-y-2">
          <Label>Page</Label>
          <Select value={formData.page_key} onValueChange={(v) => setFormData({ ...formData, page_key: v })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent className="bg-card max-h-60">
              {pages.map((p) => (
                <SelectItem key={p.key} value={p.key}>{p.name}</SelectItem>
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
            placeholder="e.g., hero_title"
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
          placeholder="Display title for this block"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Block content — this text will appear on the live page (supports HTML)"
          rows={5}
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to use the page&apos;s default/hardcoded content.
        </p>
      </div>

      {/* Image metadata */}
      {(formData.block_type === "image" || formData.block_key.includes("image")) && (
        <div className="space-y-4 p-4 rounded-xl border bg-muted/30">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Image Metadata</Label>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={(formData.metadata as any)?.url || ""}
              onChange={(e) => updateMetadata("url", e.target.value)}
              placeholder="/images/..."
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={(formData.metadata as any)?.alt || ""}
              onChange={(e) => updateMetadata("alt", e.target.value)}
              placeholder="Description for accessibility"
              className="rounded-xl"
            />
          </div>
        </div>
      )}

      {/* CTA metadata */}
      {(formData.block_type === "cta" || formData.block_key.includes("button") || formData.block_key.includes("cta")) && (
        <div className="space-y-4 p-4 rounded-xl border bg-muted/30">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA / Button Metadata</Label>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(formData.metadata as any)?.cta_text || ""}
              onChange={(e) => updateMetadata("cta_text", e.target.value)}
              placeholder="e.g., Get Started"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Button URL</Label>
            <Input
              value={(formData.metadata as any)?.cta_url || ""}
              onChange={(e) => updateMetadata("cta_url", e.target.value)}
              placeholder="e.g., /contact"
              className="rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Hero metadata */}
      {formData.block_type === "hero" && (
        <div className="space-y-4 p-4 rounded-xl border bg-muted/30">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hero Metadata</Label>
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={(formData.metadata as any)?.badge || ""}
              onChange={(e) => updateMetadata("badge", e.target.value)}
              placeholder="e.g., New Service"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary Button Text</Label>
            <Input
              value={(formData.metadata as any)?.secondary_cta_text || ""}
              onChange={(e) => updateMetadata("secondary_cta_text", e.target.value)}
              placeholder="e.g., Learn More"
              className="rounded-xl"
            />
          </div>
        </div>
      )}

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
        <div className="flex items-center gap-2 pt-6">
          <Switch
            id="block-active"
            checked={formData.is_active}
            onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
          />
          <Label htmlFor="block-active">Active</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {block?.id ? "Update Block" : "Create Block"}
        </Button>
      </div>
    </div>
  );
}
