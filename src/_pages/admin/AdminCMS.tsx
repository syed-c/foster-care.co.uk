"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────
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

// ─── API Helpers ─────────────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState("pages");
  const [pageSubTab, setPageSubTab] = useState("Static");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPage, setEditingPage] = useState<any | null>(null);

  // Data
  const [locations, setLocations] = useState<any[]>([]);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]); // All blocks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Logic
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiGet({});
      setLocations(result.locations || []);
      setContentBlocks(result.blocks || []);
    } catch (err: any) {
      console.error("CMS Fetch Error:", err);
      // Don't kill the UI, just show error toast
      toast.error("Failed to load CMS data: " + err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Derived State
  const locationPages = locations.map((loc: any) => ({
    key: `loc_${loc.slug}`,
    name: loc.name,
    path: `/locations/${loc.slug}`,
    category: loc.type === "country" ? "Countries" : loc.type === "region" ? "Regions" : loc.type === "county" ? "Counties" : "Cities",
    type: "location",
    locationType: loc.type,
  }));

  const allPages = [
    ...STATIC_PAGES.map(p => ({ ...p, type: "static", locationType: "static" })),
    ...locationPages,
  ];

  const categoryMap = {
    "Static": allPages.filter(p => p.type === "static"),
    "Countries": allPages.filter(p => p.category === "Countries"),
    "Regions": allPages.filter(p => p.category === "Regions"),
    "Counties": allPages.filter(p => p.category === "Counties"),
    "Cities": allPages.filter(p => p.category === "Cities"),
  };

  const filteredPages = categoryMap[pageSubTab as keyof typeof categoryMap]?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.path.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPageBlocksCount = (pageKey: string) => contentBlocks.filter((b: any) => b.page_key === pageKey).length;

  if (error && !locations.length) {
    return (
      <SuperAdminSidebar title="Content Management" description="Manage website pages and content blocks">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-bold">Failed to load CMS data</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </SuperAdminSidebar>
    );
  }

  return (
    <SuperAdminSidebar title="Content Management" description="Manage website pages and content blocks">
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3 shrink-0">
          <StatCard title="Total Pages" value={allPages.length} icon={Globe} />
          <StatCard title="Total Pages (Location)" value={locationPages.length} icon={LayoutGrid} />
          <StatCard title="Active Content Blocks" value={contentBlocks.length} icon={CheckCircle} />
        </div>

        {/* Main Content Area */}
        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-border">
          <CardHeader className="py-4 px-6 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Website Pages
                </CardTitle>
                <CardDescription>Select a page to edit its content</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={pageSubTab} onValueChange={setPageSubTab} className="mt-4">
              <TabsList className="bg-muted/30 p-1 flex-wrap h-auto w-full justify-start">
                {Object.keys(categoryMap).map(cat => (
                  <TabsTrigger key={cat} value={cat} className="px-3 py-1.5 rounded-md text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    {cat}
                    <Badge variant="secondary" className="ml-2 h-4 px-1 text-[9px] bg-muted-foreground/10">
                      {categoryMap[cat as keyof typeof categoryMap].length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0 bg-muted/5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading pages...</p>
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <LayoutGrid className="w-10 h-10 opacity-20" />
                <p>No pages found.</p>
              </div>
            ) : (
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPages.map((page) => {
                  const blockCount = getPageBlocksCount(page.key);
                  return (
                    <div
                      key={page.key}
                      className="group flex flex-col p-4 bg-white rounded-xl border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setEditingPage(page)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-white">
                          {blockCount} blocks
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1 line-clamp-1" title={page.name}>
                        {page.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono mb-4 line-clamp-1 opacity-70">
                        {page.path}
                      </p>
                      <Button variant="secondary" size="sm" className="w-full mt-auto h-8 text-xs font-medium">
                        <Pencil className="w-3 h-3 mr-2" />
                        Edit Content
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Editor Sheet */}
      <Sheet open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col h-full bg-white border-l shadow-2xl z-[100] translate-x-0" style={{ transform: 'none' }}>
          {editingPage ? (
            <PageEditorSheet
              page={editingPage}
              onClose={() => setEditingPage(null)}
              onDataChanged={fetchData}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </SuperAdminSidebar>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────

function PageEditorSheet({ page, onClose, onDataChanged }: { page: any, onClose: () => void, onDataChanged: () => Promise<void> }) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [editBlock, setEditBlock] = useState<any>(null); // For nested dialog
  const [editFaq, setEditFaq] = useState<any>(null);     // For nested dialog

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [b, f] = await Promise.all([
        apiGet({ action: "blocks", page_key: page.key }),
        apiGet({ action: "faqs", page_key: page.key }),
      ]);
      setBlocks(b.data || []);
      setFaqs(f.data || []);
    } catch (err: any) {
      toast.error("Failed to load page content.");
    } finally {
      setLoading(false);
    }
  }, [page.key]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await apiPost({ action: "seed_blocks", page_key: page.key, page_type: page.locationType || "static" });
      if (res.seeded > 0) {
        toast.success(`Generated ${res.seeded} blocks`);
        await loadData();
        await onDataChanged();
      } else {
        toast.info("Blocks already exist");
      }
    } catch (err: any) {
      toast.error("Failed to seed blocks: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const saveBlock = async (block: any) => {
    try {
      await apiPost({ action: "save_block", block });
      toast.success("Saved block");
      await loadData();
      await onDataChanged();
      setEditBlock(null);
    } catch (err) { toast.error("Failed to save"); }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Delete this block?")) return;
    try {
      await apiPost({ action: "delete_block", id });
      toast.success("Deleted block");
      loadData();
      onDataChanged();
    } catch (err) { toast.error("Failed to delete"); }
  };

  // Same for FAQ...
  const saveFaq = async (faq: any) => {
    try {
      await apiPost({ action: "save_faq", faq });
      toast.success("Saved FAQ");
      await loadData();
      setEditFaq(null);
    } catch (err) { toast.error("Failed to save"); }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await apiPost({ action: "delete_faq", id });
      toast.success("Deleted FAQ");
      loadData();
    } catch (err) { toast.error("Failed to delete"); }
  };

  return (
    <>
      <SheetHeader className="px-6 py-5 border-b bg-muted/5 shrink-0">
        <div className="flex flex-col gap-1">
          <SheetTitle className="text-xl">{page.name}</SheetTitle>
          <SheetDescription className="line-clamp-1 font-mono text-xs">{page.path}</SheetDescription>
        </div>
        <div className="flex gap-2 pt-2">
          {!loading && blocks.length === 0 && (
            <Button size="sm" onClick={handleSeed} disabled={seeding} variant="outline" className="h-8">
              {seeding ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2 text-primary" />}
              Auto-generate Content
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose} className="ml-auto h-8">Close</Button>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto bg-muted/10">
        <Tabs defaultValue="blocks" className="w-full">
          <div className="px-6 pt-4 sticky top-0 bg-background/95 backdrop-blur z-10 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="blocks">Content Blocks ({blocks.length})</TabsTrigger>
              <TabsTrigger value="faqs">FAQs ({faqs.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="blocks" className="p-6 space-y-4 data-[state=inactive]:hidden">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : blocks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                <LayoutGrid className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No content blocks found.</p>
                <Button variant="link" onClick={handleSeed}>Generate Defaults</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map(block => (
                  <div key={block.id} className="group bg-white p-4 rounded-xl border hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono uppercase">{block.block_type}</Badge>
                          <span className="font-medium text-sm">{block.title || block.block_key}</span>
                          {!block.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{block.block_key}</p>
                        {block.content ? (
                          <p className="text-sm text-slate-600 line-clamp-2 mt-2 pl-2 border-l-2 border-primary/20">{block.content}</p>
                        ) : (
                          <p className="text-xs text-amber-500 italic mt-1">No content set</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditBlock(block)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteBlock(block.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline" onClick={() => setEditBlock({ page_key: page.key, block_type: 'text', block_key: '', title: '', content: '', display_order: (blocks.length + 1) * 10, is_active: true })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Custom Block
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="faqs" className="p-6 space-y-4 data-[state=inactive]:hidden">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                <p>No FAQs found.</p>
                <Button variant="link" onClick={() => setEditFaq({ page_key: page.key, question: '', answer: '', display_order: 10, is_active: true })}>Create One</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map(faq => (
                  <div key={faq.id} className="group bg-white p-4 rounded-xl border hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-sm">{faq.question}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditFaq(faq)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteFaq(faq.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline" onClick={() => setEditFaq({ page_key: page.key, question: '', answer: '', display_order: (faqs.length + 1) * 10, is_active: true })}>
                  <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Nested Dialogs for Editors */}
      <Dialog open={!!editBlock} onOpenChange={(open) => !open && setEditBlock(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editBlock?.id ? "Edit Block" : "New Block"}</DialogTitle>
            <DialogDescription>Configure content block details.</DialogDescription>
          </DialogHeader>
          {editBlock && (
            <BlockEditorForm block={editBlock} onSave={saveBlock} onCancel={() => setEditBlock(null)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editFaq} onOpenChange={(open) => !open && setEditFaq(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editFaq?.id ? "Edit FAQ" : "New FAQ"}</DialogTitle>
            <DialogDescription>Configure FAQ details.</DialogDescription>
          </DialogHeader>
          {editFaq && (
            <FaqEditorForm faq={editFaq} onSave={saveFaq} onCancel={() => setEditFaq(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Simple Editor Forms ─────────────────────────────────────────────

function BlockEditorForm({ block, onSave, onCancel }: { block: any, onSave: (b: any) => void, onCancel: () => void }) {
  const [data, setData] = useState({ ...block, metadata: block.metadata || {} });

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Block Type</Label>
          <Select value={data.block_type} onValueChange={(v) => setData({ ...data, block_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {BLOCK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Key (Internal)</Label>
          <Input value={data.block_key} onChange={e => setData({ ...data, block_key: e.target.value })} placeholder="hero_title" className="font-mono text-xs" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Title (Optional)</Label>
        <Input value={data.title || ''} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Section Title" />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={data.content || ''}
          onChange={e => setData({ ...data, content: e.target.value })}
          placeholder="Enter content..."
          className="min-h-[150px] font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <Label>Order</Label>
          <Input type="number" value={data.display_order} onChange={e => setData({ ...data, display_order: +e.target.value })} />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <Switch checked={data.is_active} onCheckedChange={c => setData({ ...data, is_active: c })} />
          <Label>Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(data)}>Save Changes</Button>
      </div>
    </div>
  );
}

function FaqEditorForm({ faq, onSave, onCancel }: { faq: any, onSave: (f: any) => void, onCancel: () => void }) {
  const [data, setData] = useState({ ...faq });
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input value={data.question} onChange={e => setData({ ...data, question: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea value={data.answer} onChange={e => setData({ ...data, answer: e.target.value })} className="min-h-[100px]" />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <Label>Order</Label>
          <Input type="number" value={data.display_order} onChange={e => setData({ ...data, display_order: +e.target.value })} />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <Switch checked={data.is_active} onCheckedChange={c => setData({ ...data, is_active: c })} />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(data)}>Save FAQ</Button>
      </div>
    </div>
  );
}
