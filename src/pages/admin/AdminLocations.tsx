import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, Search, Edit, Trash2, MapPin, Filter, RefreshCw,
  Globe, Building, Home, ChevronRight, Eye, Loader2,
  Map, TrendingUp, Users
} from "lucide-react";
import { useLocations, useTopLevelLocations, type Location } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export default function AdminLocations() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [parentFilter, setParentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: locations, isLoading: loadingLocations, refetch } = useLocations();
  const { data: topLevelLocations } = useTopLevelLocations();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get agency counts per location
  const { data: locationAgencyCounts } = useQuery({
    queryKey: ["location-agency-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_locations")
        .select("location_id");
      if (error) return {};
      
      const counts: Record<string, number> = {};
      (data || []).forEach((item) => {
        counts[item.location_id] = (counts[item.location_id] || 0) + 1;
      });
      return counts;
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "region",
    parent_id: "none",
    description: "",
    seo_title: "",
    seo_description: "",
    population: 0,
    latitude: 0,
    longitude: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "region",
      parent_id: "none",
      description: "",
      seo_title: "",
      seo_description: "",
      population: 0,
      latitude: 0,
      longitude: 0,
      is_active: true,
    });
    setEditingLocation(null);
    setCurrentStep(1);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      type: location.type,
      parent_id: location.parent_id || "none",
      description: location.description || "",
      seo_title: location.seo_title || "",
      seo_description: location.seo_description || "",
      population: location.population || 0,
      latitude: location.latitude || 0,
      longitude: location.longitude || 0,
      is_active: location.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      parent_id: formData.parent_id === "none" ? null : formData.parent_id,
      description: formData.description || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      population: formData.population || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      is_active: formData.is_active,
    };

    try {
      if (editingLocation) {
        const { error } = await supabase
          .from("locations")
          .update(payload)
          .eq("id", editingLocation.id);
        if (error) throw error;
        toast({ title: "Location updated successfully" });
      } else {
        const { error } = await supabase.from("locations").insert(payload);
        if (error) throw error;
        toast({ title: "Location created successfully" });
      }
      
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Check if location has children
    const hasChildren = locations?.some(l => l.parent_id === id);
    if (hasChildren) {
      toast({ 
        title: "Cannot delete", 
        description: "This location has child locations. Please delete or reassign them first.",
        variant: "destructive" 
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      // Delete related agency_locations first
      await supabase.from("agency_locations").delete().eq("location_id", id);
      
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Location deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  // Filter locations
  const filteredLocations = locations?.filter(loc => {
    const matchesSearch = !search || 
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.slug.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || loc.type === typeFilter;
    
    const matchesParent = parentFilter === "all" || 
      (parentFilter === "none" && !loc.parent_id) ||
      loc.parent_id === parentFilter;

    return matchesSearch && matchesType && matchesParent;
  });

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "—";
    const parent = locations?.find(l => l.id === parentId);
    return parent?.name || "—";
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case "country": return <Globe className="w-4 h-4 text-blue-600" />;
      case "region": return <Map className="w-4 h-4 text-green-600" />;
      case "county": return <Building className="w-4 h-4 text-orange-600" />;
      case "city": return <Home className="w-4 h-4 text-purple-600" />;
      default: return <MapPin className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const locationTypes = [
    { value: "country", label: "Country", description: "Top-level geographic entity (e.g., England, Wales)" },
    { value: "region", label: "Region", description: "Major geographic division (e.g., North West, South East)" },
    { value: "county", label: "County", description: "Administrative county or metropolitan area" },
    { value: "city", label: "City/Town", description: "Individual city, town, or borough" },
  ];

  // Get all locations for parent selection based on hierarchy
  const getParentOptions = () => {
    const typeHierarchy: Record<string, string[]> = {
      country: [],
      region: ["country"],
      county: ["country", "region"],
      city: ["country", "region", "county"],
    };
    
    const allowedParentTypes = typeHierarchy[formData.type] || [];
    return locations?.filter(l => allowedParentTypes.includes(l.type)) || [];
  };

  // Stats
  const stats = {
    total: locations?.length || 0,
    countries: locations?.filter(l => l.type === "country").length || 0,
    regions: locations?.filter(l => l.type === "region").length || 0,
    counties: locations?.filter(l => l.type === "county").length || 0,
    cities: locations?.filter(l => l.type === "city").length || 0,
  };

  return (
    <AdminLayout title="Locations" description="Manage location hierarchy for the directory">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.countries}</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Map className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.regions}</p>
                  <p className="text-xs text-muted-foreground">Regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Building className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.counties}</p>
                  <p className="text-xs text-muted-foreground">Counties</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Home className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.cities}</p>
                  <p className="text-xs text-muted-foreground">Cities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle>All Locations</CardTitle>
                <CardDescription>
                  {filteredLocations?.length || 0} locations found
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="county">County</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                </SelectContent>
              </Select>
              <Select value={parentFilter} onValueChange={setParentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Parent Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="none">No Parent (Top Level)</SelectItem>
                  {topLevelLocations?.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {loadingLocations ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLocations?.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No locations found</p>
                <Button variant="outline" className="mt-4" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first location
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Agencies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations?.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getLocationTypeIcon(location.type)}
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">/{location.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {location.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {location.parent_id ? (
                            <div className="flex items-center gap-1 text-sm">
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                              {getParentName(location.parent_id)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {locationAgencyCounts?.[location.id] || 0} agencies
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {location.is_active ? (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              asChild
                            >
                              <a href={`/locations/${location.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(location.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Multi-Step Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              Step {currentStep} of 2: {currentStep === 1 ? "Basic Information" : "SEO & Settings"}
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                      })}
                      placeholder="Greater London"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      placeholder="greater-london"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Location Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value, parent_id: "none" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.type !== "country" && (
                  <div className="space-y-2">
                    <Label htmlFor="parent_id">Parent Location</Label>
                    <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {getParentOptions().map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            <span className="capitalize text-muted-foreground mr-2">[{loc.type}]</span>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this location for visitors..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="population">Population</Label>
                    <Input
                      id="population"
                      type="number"
                      value={formData.population || ""}
                      onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={formData.latitude || ""}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                      placeholder="51.5074"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      value={formData.longitude || ""}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                      placeholder="-0.1278"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: SEO & Settings */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="Foster Care Agencies in Greater London | Foster Care UK"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.seo_title.length}/60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="Find trusted foster care agencies in Greater London. Compare ratings, read reviews, and connect with local fostering services."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{formData.seo_description.length}/160 characters</p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this location on the public website
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                {/* Preview */}
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Search Preview</p>
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {formData.seo_title || `Foster Care in ${formData.name}`}
                  </div>
                  <p className="text-sm text-green-700">
                    fostercare.uk/locations/{formData.slug}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.seo_description || formData.description || "No description provided"}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < 2 ? (
                <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingLocation ? "Update Location" : "Create Location"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}