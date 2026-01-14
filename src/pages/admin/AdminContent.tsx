import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Search, 
  Eye, 
  Pencil, 
  Loader2,
  RefreshCw,
  MapPin
} from "lucide-react";
import { PageEditor } from "@/components/admin/cms/PageEditor";

// Define static pages in the system
const STATIC_PAGES = [
  { key: "home", name: "Home", path: "/", category: "General" },
  { key: "about", name: "About", path: "/about", category: "General" },
  { key: "contact", name: "Contact", path: "/contact", category: "General" },
  { key: "agencies", name: "Agencies", path: "/agencies", category: "General" },
  { key: "locations", name: "Locations", path: "/locations", category: "General" },
  { key: "blog", name: "Blog", path: "/blog", category: "General" },
];

// Location sections template
const LOCATION_SECTIONS = [
  { key: "hero", name: "Hero", fields: ["title", "subtitle", "content", "image_url"] },
  { key: "why_foster", name: "Why Foster Here", fields: ["title", "subtitle", "content"] },
  { key: "types", name: "Types of Fostering", fields: ["title", "subtitle", "content"] },
  { key: "how_to_start", name: "How to Start", fields: ["title", "subtitle", "content"] },
  { key: "support", name: "Support Available", fields: ["title", "subtitle", "content"] },
  { key: "cta", name: "Call to Action", fields: ["title", "subtitle", "cta_text", "cta_url"] },
];

// Define sections for each page
export const PAGE_SECTIONS: Record<string, { key: string; name: string; fields: string[] }[]> = {
  home: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content", "image_url", "cta_text", "cta_url"] },
    { key: "trust", name: "Trust Section", fields: ["title", "subtitle", "content"] },
    { key: "location_discovery", name: "Location Discovery", fields: ["title", "subtitle", "content", "cta_text", "cta_url"] },
    { key: "featured_agencies", name: "Featured Agencies", fields: ["title", "subtitle", "content"] },
    { key: "testimonials", name: "Testimonials", fields: ["title", "subtitle", "content"] },
    { key: "agency_cta", name: "Agency CTA", fields: ["title", "subtitle", "content", "cta_text", "cta_url"] },
    { key: "lead_cta", name: "Lead CTA", fields: ["title", "subtitle", "content", "cta_text", "cta_url"] },
  ],
  about: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content", "image_url"] },
    { key: "mission", name: "Mission", fields: ["title", "subtitle", "content"] },
    { key: "values", name: "Values", fields: ["title", "subtitle", "content"] },
    { key: "team", name: "Team", fields: ["title", "subtitle", "content"] },
    { key: "cta", name: "Call to Action", fields: ["title", "subtitle", "cta_text", "cta_url"] },
  ],
  contact: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content"] },
    { key: "info", name: "Contact Info", fields: ["title", "content"] },
    { key: "form_intro", name: "Form Introduction", fields: ["title", "subtitle", "content"] },
  ],
  agencies: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content"] },
    { key: "filters", name: "Filters Section", fields: ["title", "content"] },
    { key: "cta", name: "Call to Action", fields: ["title", "subtitle", "cta_text", "cta_url"] },
  ],
  locations: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content"] },
    { key: "regions", name: "Regions Section", fields: ["title", "subtitle"] },
  ],
  blog: [
    { key: "hero", name: "Hero", fields: ["title", "subtitle", "content"] },
    { key: "featured", name: "Featured Posts", fields: ["title", "subtitle"] },
  ],
};

const AdminContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [editingPage, setEditingPage] = useState<string | null>(null);

  // Fetch all CMS content
  const { data: contents, isLoading, refetch } = useQuery({
    queryKey: ["admin-cms-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .order("page_key")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Fetch locations for dynamic pages
  const { data: locations } = useQuery({
    queryKey: ["admin-locations-cms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, slug, type")
        .order("type")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Build dynamic location pages
  const locationPages = (locations || []).map(loc => ({
    key: `location_${loc.slug}`,
    name: loc.name,
    path: `/locations/${loc.slug}`,
    category: loc.type === "country" ? "Countries" : loc.type === "region" ? "Regions" : "Cities",
    isLocation: true,
  }));

  // Combine static and location pages with proper typing
  const allPages: Array<{ key: string; name: string; path: string; category: string; isLocation?: boolean }> = [
    ...STATIC_PAGES.map(p => ({ ...p, isLocation: false })),
    ...locationPages,
  ];

  const categories = ["All", "General", "Countries", "Regions", "Cities"];

  const filteredPages = allPages.filter((page) => {
    const matchesSearch = 
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || page.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get sections for a page - use location template for location pages
  const getSectionsForPage = (pageKey: string, isLocation?: boolean) => {
    if (isLocation) return LOCATION_SECTIONS;
    return PAGE_SECTIONS[pageKey] || [];
  };

  const getPageContentCount = (pageKey: string) => {
    return contents?.filter(c => c.page_key === pageKey).length || 0;
  };

  return (
    <SuperAdminSidebar title="CMS Content" description="View and edit SEO and content for site pages">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Pages Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pages
            </CardTitle>
            <CardDescription>Search and manage all available pages</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages by title or path"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pages List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPages.map((page) => (
                  <div
                    key={page.key}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{page.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {getPageContentCount(page.key)} sections
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{page.path}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={page.path} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button size="sm" onClick={() => setEditingPage(page.key)}>
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Page Editor Dialog */}
        <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Edit Page: {allPages.find(p => p.key === editingPage)?.path || editingPage}
              </DialogTitle>
            </DialogHeader>
            {editingPage && (
              <PageEditor 
                pageKey={editingPage} 
                sections={getSectionsForPage(editingPage, allPages.find(p => p.key === editingPage)?.isLocation)}
                contents={contents || []}
                onClose={() => setEditingPage(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminSidebar>
  );
};

export default AdminContent;
