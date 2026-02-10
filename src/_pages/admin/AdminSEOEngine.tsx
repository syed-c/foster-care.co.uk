"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Globe, 
  MapPin, 
  FileText, 
  Link as LinkIcon, 
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Eye,
  ExternalLink,
  Loader2,
  TrendingUp,
  Settings
} from "lucide-react";

export default function AdminSEOEngine() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("locations");

  // Fetch locations
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["admin-seo-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("type", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch pages for indexing
  const { data: cmsPages } = useQuery({
    queryKey: ["admin-seo-cms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .order("page_key");
      if (error) throw error;
      return data;
    },
  });

  // Location stats
  const countryLocations = locations?.filter(l => l.type === "country") || [];
  const regionLocations = locations?.filter(l => l.type === "region") || [];
  const cityLocations = locations?.filter(l => l.type === "city") || [];
  const areaLocations = locations?.filter(l => l.type === "area") || [];
  const activeLocations = locations?.filter(l => l.is_active) || [];

  return (
    <SuperAdminSidebar title="SEO Engine" description="Control page launches, indexing, and internal linking">
      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{countryLocations.length}</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warm/10">
                <MapPin className="w-5 h-5 text-warm" />
              </div>
              <div>
                <p className="text-2xl font-bold">{regionLocations.length}</p>
                <p className="text-xs text-muted-foreground">Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-verified/10">
                <MapPin className="w-5 h-5 text-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cityLocations.length}</p>
                <p className="text-xs text-muted-foreground">Cities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{areaLocations.length}</p>
                <p className="text-xs text-muted-foreground">Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-verified/10">
                <CheckCircle className="w-5 h-5 text-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeLocations.length}</p>
                <p className="text-xs text-muted-foreground">Active Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-card border mb-6">
          <TabsTrigger value="locations">
            <MapPin className="w-4 h-4 mr-2" />
            Location Pages
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="w-4 h-4 mr-2" />
            Content Quality
          </TabsTrigger>
          <TabsTrigger value="linking">
            <LinkIcon className="w-4 h-4 mr-2" />
            Internal Linking
          </TabsTrigger>
          <TabsTrigger value="indexing">
            <Search className="w-4 h-4 mr-2" />
            Indexing Control
          </TabsTrigger>
        </TabsList>

        {/* Location Pages */}
        <TabsContent value="locations">
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Location Page Management</CardTitle>
                  <CardDescription>Control which location pages are active and indexed</CardDescription>
                </div>
                <Button className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Agencies</TableHead>
                      <TableHead>SEO Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : locations && locations.length > 0 ? (
                      locations.slice(0, 20).map((location) => (
                        <TableRow key={location.id}>
                          <TableCell>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-muted-foreground">/locations/{location.slug}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {location.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {location.parent_id ? "Has parent" : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{location.agency_count || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            {location.seo_title && location.seo_description ? (
                              <Badge className="bg-verified/10 text-verified border-verified/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Partial
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch checked={location.is_active ?? true} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No locations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Quality */}
        <TabsContent value="content">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Content Quality Checks</CardTitle>
              <CardDescription>Ensure all pages meet content quality standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-verified/5 border-verified/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-verified" />
                    <span className="font-medium">Content Rules</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                    <li>• AI drafts only - human approval required</li>
                    <li>• No duplicate content across pages</li>
                    <li>• No exaggeration or guarantees</li>
                    <li>• All claims must be verifiable</li>
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Pages with SEO Titles</span>
                      <Badge className="bg-verified/10 text-verified">
                        {locations?.filter(l => l.seo_title).length || 0} / {locations?.length || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-verified h-2 rounded-full" 
                        style={{ 
                          width: `${((locations?.filter(l => l.seo_title).length || 0) / (locations?.length || 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Pages with Descriptions</span>
                      <Badge className="bg-verified/10 text-verified">
                        {locations?.filter(l => l.seo_description).length || 0} / {locations?.length || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-verified h-2 rounded-full" 
                        style={{ 
                          width: `${((locations?.filter(l => l.seo_description).length || 0) / (locations?.length || 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internal Linking */}
        <TabsContent value="linking">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Internal Linking Strategy</CardTitle>
              <CardDescription>Family-thinking navigation paths between pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-xl border bg-primary/5">
                    <h4 className="font-medium mb-2">Location Linking</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• UK → Regions → Cities → Areas</li>
                      <li>• Nearby locations sidebar</li>
                      <li>• Parent/child breadcrumbs</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border bg-warm/5">
                    <h4 className="font-medium mb-2">Service Linking</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Service + Location pages</li>
                      <li>• Related specialisms</li>
                      <li>• Agency type connections</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border bg-verified/5">
                    <h4 className="font-medium mb-2">Discovery Linking</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Comparison pages</li>
                      <li>• Similar agencies</li>
                      <li>• Intent-based suggestions</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Linking Rules
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Auto-link to parent location</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Show nearby locations</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Link related specialisms</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Include comparison CTAs</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indexing Control */}
        <TabsContent value="indexing">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Indexing Gates</CardTitle>
              <CardDescription>Control which pages are indexed by search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">Indexing Requirements</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Pages must meet quality thresholds before being indexed:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-8 mt-2">
                    <li>• At least 1 active agency in location</li>
                    <li>• SEO title and description set</li>
                    <li>• Content quality approved</li>
                    <li>• No duplicate content flags</li>
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-xl border">
                    <h4 className="font-medium mb-3">Robots.txt Control</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">/admin/*</span>
                        <Badge variant="secondary">Disallow</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">/api/*</span>
                        <Badge variant="secondary">Disallow</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">/locations/*</span>
                        <Badge className="bg-verified/10 text-verified">Allow</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">/agencies/*</span>
                        <Badge className="bg-verified/10 text-verified">Allow</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border">
                    <h4 className="font-medium mb-3">Sitemap Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last generated</span>
                        <span className="text-sm text-muted-foreground">Today</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total URLs</span>
                        <Badge variant="outline">{(locations?.length || 0) + 50}</Badge>
                      </div>
                      <Button variant="outline" className="w-full rounded-full mt-2">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Sitemap
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SuperAdminSidebar>
  );
}