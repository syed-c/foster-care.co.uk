"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
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
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Pencil,
  Loader2,
  Save,
  MapPin,
  Globe,
  LayoutGrid,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Copy,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ContentBlock {
  id?: string;
  page_key: string;
  block_key: string;
  block_type: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown>;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent_id: string | null;
  parent?: Location | null;
}

const REGION_BLOCKS = [
  { key: "hero_badge", label: "Hero Badge", type: "text", placeholder: "e.g., Regional Fostering Hub" },
  { key: "hero_title", label: "Hero Title", type: "rich", placeholder: "The main title displayed in the hero section" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "rich", placeholder: "The subtitle shown below the title" },
  { key: "hero_cta", label: "Hero CTA Button", type: "cta", placeholder: "Button text" },
  
  { key: "intro_title", label: "Intro Section Title", type: "rich", placeholder: "Title for the introduction section" },
  { key: "intro_content", label: "Intro Section Content", type: "rich", placeholder: "Main content for the introduction section" },
  
  { key: "is_right_title", label: "Is Fostering Right - Title", type: "rich", placeholder: "Title for the 'Is Fostering Right' section" },
  { key: "is_right_content", label: "Is Fostering Right - Content", type: "rich", placeholder: "Content explaining who should consider fostering" },
  
  { key: "agency_types_title", label: "Agency Types Section Title", type: "rich", placeholder: "Title for agency types comparison" },
  { key: "agency_types_intro", label: "Agency Types Intro", type: "rich", placeholder: "Introduction to agency types section" },
  { key: "ifa_title", label: "IFA Card Title", type: "rich", placeholder: "Independent Fostering Agencies title" },
  { key: "ifa_content", label: "IFA Card Content", type: "rich", placeholder: "Content about IFAs" },
  { key: "la_title", label: "Local Authority Title", type: "rich", placeholder: "Local Authority card title" },
  { key: "la_content", label: "Local Authority Content", type: "rich", placeholder: "Content about Local Authorities" },
  
  { key: "ofsted_title", label: "Ofsted Section Title", type: "rich", placeholder: "Title for Ofsted section" },
  { key: "ofsted_intro", label: "Ofsted Section Intro", type: "rich", placeholder: "Introduction about Ofsted ratings" },
  
  { key: "support_title", label: "Support Section Title", type: "rich", placeholder: "Title for support section" },
  { key: "support_intro", label: "Support Section Intro", type: "rich", placeholder: "Introduction about support available" },
  
  { key: "guide_title", label: "Guide Section Title", type: "rich", placeholder: "Title for who this guide is for" },
  { key: "guide_intro", label: "Guide Section Content", type: "rich", placeholder: "Content about the guide" },
  
  { key: "glossary_title", label: "Glossary Section Title", type: "rich", placeholder: "Title for glossary section" },
  { key: "glossary_intro", label: "Glossary Section Intro", type: "rich", placeholder: "Introduction to glossary" },
  
  { key: "faq_title", label: "FAQ Section Title", type: "rich", placeholder: "Title for FAQ section" },
];

export default function AdminRegionCMS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingRegion, setEditingRegion] = useState<Location | null>(null);
  const queryClient = useQueryClient();

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["admin-locations-for-cms"],
    queryFn: async () => {
      const { data: locs, error } = await supabase
        .from("locations")
        .select("id, name, slug, type, parent_id")
        .order("type")
        .order("name");
      if (error) throw error;
      
      const locationsWithParents = locs?.map(loc => {
        const parent = locs.find(l => l.id === loc.parent_id);
        return { ...loc, parent };
      }) || [];
      
      return locationsWithParents;
    },
  });

  const { data: blocks, isLoading: blocksLoading, refetch: refetchBlocks } = useQuery<ContentBlock[]>({
    queryKey: ["admin-region-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content_blocks")
        .select("*")
        .like("page_key", "loc_%")
        .order("page_key")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const filteredLocations = locations?.filter((loc) => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || loc.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  const getBlocksCountForRegion = (loc: Location) => {
    const path = buildLocationPath(loc).replace('/locations/', '');
    const pageKey = `loc_${path}`;
    return blocks?.filter(b => b.page_key === pageKey).length || 0;
  };

  const groupedLocations = {
    countries: filteredLocations.filter(l => l.type === "country"),
    regions: filteredLocations.filter(l => l.type === "region"),
    counties: filteredLocations.filter(l => l.type === "county"),
  };

  return (
    <SuperAdminSidebar title="Region Content CMS" description="Edit content for region, county and city pages">
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-6 overflow-hidden">
        <div className="grid gap-4 sm:grid-cols-3 shrink-0">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groupedLocations.countries.length}</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groupedLocations.regions.length}</p>
                  <p className="text-sm text-muted-foreground">Regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <LayoutGrid className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{blocks?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Content Blocks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm min-h-0">
          <CardHeader className="py-4 px-6 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  Region Pages
                </CardTitle>
                <CardDescription>Select a location to edit its content blocks</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
              >
                All <Badge variant="secondary" className="ml-2">{filteredLocations.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "country" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("country")}
              >
                Countries <Badge variant="secondary" className="ml-2">{groupedLocations.countries.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "region" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("region")}
              >
                Regions <Badge variant="secondary" className="ml-2">{groupedLocations.regions.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "county" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("county")}
              >
                Counties <Badge variant="secondary" className="ml-2">{groupedLocations.counties.length}</Badge>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0 bg-muted/5 min-h-0">
            {locationsLoading || blocksLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading locations...</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <MapPin className="w-10 h-10 opacity-20" />
                <p>No locations found.</p>
              </div>
            ) : (
              <div className="p-6">
                {typeFilter === "all" || typeFilter === "country" ? (
                  groupedLocations.countries.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Countries
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.countries.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}

                {typeFilter === "all" || typeFilter === "region" ? (
                  groupedLocations.regions.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Regions
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.regions.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}

                {typeFilter === "all" || typeFilter === "county" ? (
                  groupedLocations.counties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" /> Counties
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.counties.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!editingRegion} onOpenChange={(open) => !open && setEditingRegion(null)}>
        <SheetContent side="right" className="w-full sm:max-w-3xl md:max-w-4xl p-0 flex flex-col h-full bg-white border-l shadow-2xl z-[100]">
          {editingRegion ? (
            <RegionBlockEditor
              location={editingRegion}
              locationPath={buildLocationPath(editingRegion)}
              onClose={() => {
                setEditingRegion(null);
                queryClient.invalidateQueries({ queryKey: ["admin-region-blocks"] });
              }}
              onSave={() => {
                refetchBlocks();
                queryClient.invalidateQueries({ queryKey: ["admin-region-blocks"] });
              }}
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

function buildLocationPath(loc: Location): string {
  const parts: string[] = [];
  let current: Location | null = loc;
  
  while (current) {
    parts.unshift(current.slug);
    current = current.parent || null;
  }
  
  return `/locations/${parts.join('/')}`;
}

function LocationCard({ 
  location, 
  blocksCount, 
  onEdit 
}: { 
  location: Location; 
  blocksCount: number;
  onEdit: () => void;
}) {
  const typeColors: Record<string, string> = {
    country: "bg-primary/10 text-primary border-primary/20",
    region: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    county: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    city: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  const locationPath = buildLocationPath(location);

  return (
    <div className="group flex flex-col p-4 bg-white rounded-xl border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer" onClick={onEdit}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg border", typeColors[location.type] || "bg-slate-100")}>
          {location.type === "country" ? <Globe className="w-4 h-4" /> : 
           location.type === "region" ? <MapPin className="w-4 h-4" /> : 
           <LayoutGrid className="w-4 h-4" />}
        </div>
        <Badge variant="outline" className="text-[10px] bg-white">
          {blocksCount} blocks
        </Badge>
      </div>
      <h4 className="font-semibold text-sm mb-1 line-clamp-1" title={location.name}>
        {location.name}
      </h4>
      <p className="text-xs text-muted-foreground font-mono mb-4 line-clamp-1 opacity-70">
        {locationPath}
      </p>
      <Button variant="secondary" size="sm" className="w-full mt-auto h-8 text-xs font-medium">
        <Pencil className="w-3 h-3 mr-2" />
        Edit Content
      </Button>
    </div>
  );
}

function RegionBlockEditor({
  location,
  locationPath,
  onClose,
  onSave,
}: {
  location: Location;
  locationPath: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const queryClient = useQueryClient();
  const pathSlug = locationPath.replace('/locations/', '');
  const pageKey = `loc_${pathSlug}`;
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [editBlock, setEditBlock] = useState<ContentBlock | null>(null);

  const { data: blocks, isLoading, refetch } = useQuery<ContentBlock[]>({
    queryKey: ["region-blocks", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content_blocks")
        .select("*")
        .eq("page_key", pageKey)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (block: Partial<ContentBlock>) => {
      setSaving(true);
      const blockData = { ...block };
      delete blockData.created_at;
      delete blockData.updated_at;
      
      if (block.id) {
        const { data, error } = await supabase
          .from("page_content_blocks")
          .update({ ...blockData, updated_at: new Date().toISOString() })
          .eq("id", block.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("page_content_blocks")
          .insert({ ...blockData, page_key: pageKey })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success("Content saved successfully");
      refetch();
      setEditBlock(null);
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
    onSettled: () => {
      setSaving(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("page_content_blocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Block deleted");
      refetch();
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const generateBlocksMutation = useMutation({
    mutationFn: async () => {
      const defaultBlocks = REGION_BLOCKS.map((blockDef, index) => ({
        page_key: pageKey,
        block_key: blockDef.key,
        block_type: blockDef.type === "rich" ? "text" : blockDef.type,
        title: blockDef.label,
        content: "",
        metadata: {},
        display_order: index + 1,
        is_active: true,
      }));

      const { data: existing } = await supabase
        .from("page_content_blocks")
        .select("block_key")
        .eq("page_key", pageKey);

      const existingKeys = new Set((existing || []).map(b => b.block_key));
      const newBlocks = defaultBlocks.filter(b => !existingKeys.has(b.block_key));

      if (newBlocks.length > 0) {
        const { error } = await supabase
          .from("page_content_blocks")
          .insert(newBlocks);
        if (error) throw error;
      }

      return newBlocks.length;
    },
    onSuccess: (count) => {
      toast.success(`Generated ${count} new content blocks`);
      refetch();
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate: ${error.message}`);
    },
  });

  const getBlockValue = (blockKey: string): string => {
    const block = blocks?.find(b => b.block_key === blockKey);
    return block?.content || "";
  };

  const getBlock = (blockKey: string): ContentBlock | undefined => {
    return blocks?.find(b => b.block_key === blockKey);
  };

  const handleSaveBlock = (blockData: Partial<ContentBlock>) => {
    saveMutation.mutate(blockData);
  };

  const handleDeleteBlock = (id: string) => {
    if (confirm("Are you sure you want to delete this block?")) {
      deleteMutation.mutate(id);
    }
  };

  const groupedBlocks = {
    "Hero Section": ["hero_badge", "hero_title", "hero_subtitle", "hero_cta"],
    "Introduction": ["intro_title", "intro_content"],
    "Is Fostering Right": ["is_right_title", "is_right_content"],
    "Agency Types": ["agency_types_title", "agency_types_intro", "ifa_title", "ifa_content", "la_title", "la_content"],
    "Ofsted Section": ["ofsted_title", "ofsted_intro"],
    "Support Section": ["support_title", "support_intro"],
    "Guide Section": ["guide_title", "guide_intro"],
    "Glossary": ["glossary_title", "glossary_intro"],
    "FAQ": ["faq_title"],
  };

  return (
    <>
      <SheetHeader className="px-6 py-5 border-b bg-muted/5 shrink-0">
        <div className="flex flex-col gap-1">
          <SheetTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {location.name}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {locationPath}
          </SheetDescription>
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={() => generateBlocksMutation.mutate()} 
            disabled={generateBlocksMutation.isPending}
            variant="outline" 
            className="h-8"
          >
            {generateBlocksMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-2" />
            )}
            Generate Blocks
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="ml-auto h-8">
            Close
          </Button>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
          <div className="px-6 pt-4 shrink-0 bg-background/95 backdrop-blur z-10 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content">Content Blocks ({blocks?.length || 0})</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="flex-1 overflow-y-auto p-6 data-[state=inactive]:hidden min-h-0">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBlocks).map(([group, blockKeys]) => (
                  <div key={group} className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 pb-2 border-b">
                      <ChevronRight className="w-4 h-4" />
                      {group}
                    </h3>
                    <div className="grid gap-4">
                      {blockKeys.map((blockKey) => {
                        const blockDef = REGION_BLOCKS.find(b => b.key === blockKey);
                        const block = getBlock(blockKey);
                        const value = block?.content || "";

                        return (
                          <div
                            key={blockKey}
                            className="bg-white p-4 rounded-xl border hover:border-primary/30 transition-all shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">
                                  {blockDef?.label || blockKey}
                                </Label>
                                <p className="text-xs text-muted-foreground font-mono mt-1">
                                  {blockKey}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={block?.is_active ?? false}
                                  onCheckedChange={(checked) => {
                                    if (block) {
                                      saveMutation.mutate({ ...block, is_active: checked });
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditBlock(block || {
                                    page_key: pageKey,
                                    block_key: blockKey,
                                    block_type: blockDef?.type === "rich" ? "text" : blockDef?.type || "text",
                                    title: blockDef?.label || blockKey,
                                    content: "",
                                    metadata: {},
                                    display_order: blockKeys.indexOf(blockKey) + 1,
                                    is_active: true,
                                  } as ContentBlock)}
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                {block && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteBlock(block.id)}
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            </div>
                            {value ? (
                              <div 
                                className="text-sm text-slate-600 line-clamp-3 p-3 bg-slate-50 rounded-lg prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            ) : (
                              <p className="text-xs text-amber-500 italic p-3 bg-amber-50 rounded-lg">
                                No content - Click Edit to add content
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto p-6 data-[state=inactive]:hidden min-h-0">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Live Page Preview</h3>
                <p className="text-sm text-muted-foreground">
                  This shows how your content will appear on the live page. 
                  <a 
                    href={locationPath} 
                    target="_blank" 
                    className="text-primary hover:underline ml-1"
                  >
                    View live page →
                  </a>
                </p>
              </div>
              
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-slate-400">{locationPath}</span>
                </div>
                <div className="p-8 bg-white">
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge variant="outline" className="mb-4">
                        {getBlockValue("hero_badge") || "Hero Badge"}
                      </Badge>
                      <h1 
                        className="text-4xl font-bold"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("hero_title") || `Fostering in ${location.name}` }}
                      />
                      <p 
                        className="mt-4 text-lg text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("hero_subtitle") || "Subtitle content..." }}
                      />
                    </div>

                    <hr />

                    <div>
                      <h2 
                        className="text-2xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("intro_title") || "Introduction Title" }}
                      />
                      <div 
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("intro_content") || "<p>Introduction content...</p>" }}
                      />
                    </div>

                    <hr />

                    <div>
                      <h2 
                        className="text-2xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("agency_types_title") || "Agency Types" }}
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg">
                          <h3 
                            className="font-bold mb-2"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("ifa_title") || "Independent Fostering Agencies" }}
                          />
                          <div 
                            className="prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("ifa_content") || "<p>IFA content...</p>" }}
                          />
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 
                            className="font-bold mb-2"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("la_title") || "Local Authority" }}
                          />
                          <div 
                            className="prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("la_content") || "<p>LA content...</p>" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {editBlock && (
        <BlockEditModal
          block={editBlock}
          blockDef={REGION_BLOCKS.find(b => b.key === editBlock.block_key)}
          onSave={handleSaveBlock}
          onCancel={() => setEditBlock(null)}
          saving={saving}
        />
      )}
    </>
  );
}

function BlockEditModal({
  block,
  blockDef,
  onSave,
  onCancel,
  saving,
}: {
  block: Partial<ContentBlock>;
  blockDef?: { key: string; label: string; type: string; placeholder: string };
  onSave: (block: Partial<ContentBlock>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    content: block.content || "",
    title: block.title || "",
    is_active: block.is_active ?? true,
  });

  const isRichType = blockDef?.type === "rich";

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Edit: {blockDef?.label || block.block_key}</h2>
          <p className="text-sm text-muted-foreground font-mono mt-1">{block.block_key}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <Label>Internal Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Internal title for reference"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Content {isRichType && <span className="text-primary">(Rich Text - Supports H1, H2, H3, Bold, Lists)</span>}
            </Label>
            {isRichType ? (
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder={blockDef?.placeholder || "Enter content..."}
              />
            ) : (
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={blockDef?.placeholder || "Enter content..."}
                rows={6}
                className="font-mono"
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Active (show on page)</Label>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSave({ ...block, ...formData })} 
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
