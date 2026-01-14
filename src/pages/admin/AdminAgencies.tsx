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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Edit, Trash2, BadgeCheck, Star, Filter, 
  Building2, MapPin, Phone, Mail, Globe, Eye, MoreHorizontal,
  Download, Upload, RefreshCw, CheckCircle, XCircle, Loader2
} from "lucide-react";
import { useAgencies, type Agency } from "@/hooks/useAgencies";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminAgencies() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: agencies, isLoading: loadingAgencies, refetch } = useAgencies();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch locations for area assignment
  const { data: locations } = useQuery({
    queryKey: ["admin-locations-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, type, slug")
        .order("type")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch specialisms
  const { data: specialisms } = useQuery({
    queryKey: ["admin-specialisms-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("specialisms")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    city: "",
    county: "",
    postcode: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    agency_type: "independent",
    is_verified: false,
    is_featured: false,
    is_active: true,
    rating: 0,
    review_count: 0,
    ofsted_rating: "",
    ofsted_urn: "",
    acceptance_types: [] as string[],
    languages: [] as string[],
    complex_needs_support: false,
    selectedLocations: [] as string[],
    selectedSpecialisms: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      city: "",
      county: "",
      postcode: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      agency_type: "independent",
      is_verified: false,
      is_featured: false,
      is_active: true,
      rating: 0,
      review_count: 0,
      ofsted_rating: "",
      ofsted_urn: "",
      acceptance_types: [],
      languages: [],
      complex_needs_support: false,
      selectedLocations: [],
      selectedSpecialisms: [],
    });
    setEditingAgency(null);
    setCurrentStep(1);
  };

  const handleEdit = async (agency: Agency) => {
    setEditingAgency(agency);
    
    // Fetch agency locations
    const { data: agencyLocs } = await supabase
      .from("agency_locations")
      .select("location_id")
      .eq("agency_id", agency.id);
    
    // Fetch agency specialisms
    const { data: agencySpecs } = await supabase
      .from("agency_specialisms")
      .select("specialism_id")
      .eq("agency_id", agency.id);

    setFormData({
      name: agency.name,
      slug: agency.slug,
      description: agency.description || "",
      short_description: agency.short_description || "",
      city: agency.city || "",
      county: agency.county || "",
      postcode: agency.postcode || "",
      address: agency.address || "",
      phone: agency.phone || "",
      email: agency.email || "",
      website: agency.website || "",
      agency_type: agency.agency_type || "independent",
      is_verified: agency.is_verified || false,
      is_featured: agency.is_featured || false,
      is_active: agency.is_active ?? true,
      rating: agency.rating || 0,
      review_count: agency.review_count || 0,
      ofsted_rating: agency.ofsted_rating || "",
      ofsted_urn: agency.ofsted_urn || "",
      acceptance_types: agency.acceptance_types || [],
      languages: agency.languages || [],
      complex_needs_support: agency.complex_needs_support || false,
      selectedLocations: agencyLocs?.map(l => l.location_id) || [],
      selectedSpecialisms: agencySpecs?.map(s => s.specialism_id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const agencyData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        city: formData.city || null,
        county: formData.county || null,
        postcode: formData.postcode || null,
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        agency_type: formData.agency_type || null,
        is_verified: formData.is_verified,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        rating: formData.rating || null,
        review_count: formData.review_count || null,
        ofsted_rating: formData.ofsted_rating || null,
        ofsted_urn: formData.ofsted_urn || null,
        acceptance_types: formData.acceptance_types.length > 0 ? formData.acceptance_types : null,
        languages: formData.languages.length > 0 ? formData.languages : null,
        complex_needs_support: formData.complex_needs_support,
      };

      let agencyId: string;

      if (editingAgency) {
        const { error } = await supabase
          .from("agencies")
          .update(agencyData)
          .eq("id", editingAgency.id);
        if (error) throw error;
        agencyId = editingAgency.id;
        
        // Clear existing locations and specialisms
        await supabase.from("agency_locations").delete().eq("agency_id", agencyId);
        await supabase.from("agency_specialisms").delete().eq("agency_id", agencyId);
      } else {
        const { data, error } = await supabase
          .from("agencies")
          .insert(agencyData)
          .select("id")
          .single();
        if (error) throw error;
        agencyId = data.id;
      }

      // Add locations
      if (formData.selectedLocations.length > 0) {
        const locationInserts = formData.selectedLocations.map((locationId, index) => ({
          agency_id: agencyId,
          location_id: locationId,
          is_primary: index === 0,
        }));
        await supabase.from("agency_locations").insert(locationInserts);
      }

      // Add specialisms
      if (formData.selectedSpecialisms.length > 0) {
        const specialismInserts = formData.selectedSpecialisms.map((specialismId, index) => ({
          agency_id: agencyId,
          specialism_id: specialismId,
          is_primary: index === 0,
        }));
        await supabase.from("agency_specialisms").insert(specialismInserts);
      }

      toast({ title: editingAgency ? "Agency updated successfully" : "Agency created successfully" });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
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
    if (!confirm("Are you sure you want to delete this agency? This will also remove all related data.")) return;

    try {
      // Delete related records first
      await supabase.from("agency_locations").delete().eq("agency_id", id);
      await supabase.from("agency_specialisms").delete().eq("agency_id", id);
      await supabase.from("reviews").delete().eq("agency_id", id);
      
      const { error } = await supabase.from("agencies").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Agency deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const handleToggleVerified = async (agency: Agency) => {
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ is_verified: !agency.is_verified })
        .eq("id", agency.id);
      if (error) throw error;
      toast({ title: agency.is_verified ? "Agency unverified" : "Agency verified" });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleFeatured = async (agency: Agency) => {
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ is_featured: !agency.is_featured })
        .eq("id", agency.id);
      if (error) throw error;
      toast({ title: agency.is_featured ? "Removed from featured" : "Added to featured" });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Filter agencies
  const filteredAgencies = agencies?.filter(agency => {
    const matchesSearch = !search || 
      agency.name.toLowerCase().includes(search.toLowerCase()) ||
      agency.city?.toLowerCase().includes(search.toLowerCase()) ||
      agency.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && agency.is_active) ||
      (statusFilter === "inactive" && !agency.is_active);
    
    const matchesVerified = verifiedFilter === "all" ||
      (verifiedFilter === "verified" && agency.is_verified) ||
      (verifiedFilter === "unverified" && !agency.is_verified);
    
    const matchesFeatured = featuredFilter === "all" ||
      (featuredFilter === "featured" && agency.is_featured) ||
      (featuredFilter === "not_featured" && !agency.is_featured);

    return matchesSearch && matchesStatus && matchesVerified && matchesFeatured;
  });

  const agencyTypes = [
    { value: "independent", label: "Independent Fostering Agency" },
    { value: "local_authority", label: "Local Authority" },
    { value: "voluntary", label: "Voluntary Agency" },
    { value: "private", label: "Private Agency" },
  ];

  const acceptanceTypeOptions = [
    "0-5 years", "5-11 years", "11-18 years", 
    "Sibling groups", "LGBTQ+ young people", "Unaccompanied asylum seekers",
    "Children with disabilities", "Parent and child placements"
  ];

  const groupedLocations = locations?.reduce((acc, loc) => {
    if (!acc[loc.type]) acc[loc.type] = [];
    acc[loc.type].push(loc);
    return acc;
  }, {} as Record<string, typeof locations>);

  return (
    <AdminLayout title="Agencies" description="Manage foster care agencies">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agencies?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Agencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agencies?.filter(a => a.is_verified).length || 0}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agencies?.filter(a => a.is_featured).length || 0}</p>
                  <p className="text-xs text-muted-foreground">Featured</p>
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
                  <p className="text-2xl font-bold">{agencies?.filter(a => a.is_active).length || 0}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
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
                <CardTitle>All Agencies</CardTitle>
                <CardDescription>
                  {filteredAgencies?.length || 0} agencies found
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agency
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
                  placeholder="Search by name, city, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not_featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {loadingAgencies ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAgencies?.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No agencies found</p>
                <Button variant="outline" className="mt-4" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first agency
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgencies?.map((agency) => (
                      <TableRow key={agency.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{agency.name}</span>
                                {agency.is_verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {agency.email || agency.phone || "No contact info"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {agency.city || agency.county || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {agency.agency_type?.replace("_", " ") || "Independent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">
                              {agency.rating ? Number(agency.rating).toFixed(1) : "—"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({agency.review_count || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {agency.is_featured && (
                              <Badge className="bg-yellow-100 text-yellow-700 text-xs">Featured</Badge>
                            )}
                            {agency.is_verified ? (
                              <Badge className="bg-green-100 text-green-700 text-xs">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Unverified</Badge>
                            )}
                            {!agency.is_active && (
                              <Badge variant="destructive" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleVerified(agency)}
                              title={agency.is_verified ? "Unverify" : "Verify"}
                            >
                              {agency.is_verified ? (
                                <XCircle className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleFeatured(agency)}
                              title={agency.is_featured ? "Remove from featured" : "Feature"}
                            >
                              <Star className={`w-4 h-4 ${agency.is_featured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(agency)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(agency.id)}>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAgency ? "Edit Agency" : "Add New Agency"}</DialogTitle>
            <DialogDescription>
              Step {currentStep} of 3: {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Contact & Location" : "Coverage & Specialisms"}
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
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
                    <Label htmlFor="name">Agency Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                      })}
                      placeholder="Foster Care Agency Ltd"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      placeholder="foster-care-agency-ltd"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief one-line description"
                    maxLength={160}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed agency description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency_type">Agency Type</Label>
                    <Select value={formData.agency_type} onValueChange={(value) => setFormData({ ...formData, agency_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {agencyTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ofsted_rating">Ofsted Rating</Label>
                    <Select value={formData.ofsted_rating} onValueChange={(value) => setFormData({ ...formData, ofsted_rating: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outstanding">Outstanding</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="requires_improvement">Requires Improvement</SelectItem>
                        <SelectItem value="inadequate">Inadequate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_verified"
                      checked={formData.is_verified}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                    />
                    <Label htmlFor="is_verified">Verified</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@agency.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0800 123 4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.agency.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 High Street"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="London"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                      placeholder="Greater London"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="ofsted_urn">Ofsted URN</Label>
                    <Input
                      id="ofsted_urn"
                      value={formData.ofsted_urn}
                      onChange={(e) => setFormData({ ...formData, ofsted_urn: e.target.value })}
                      placeholder="SC123456"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="complex_needs"
                      checked={formData.complex_needs_support}
                      onCheckedChange={(checked) => setFormData({ ...formData, complex_needs_support: checked })}
                    />
                    <Label htmlFor="complex_needs">Supports Complex Needs</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Coverage & Specialisms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Service Areas (Locations)</Label>
                  <p className="text-sm text-muted-foreground">Select all locations this agency covers</p>
                  <div className="max-h-[200px] overflow-y-auto border rounded-lg p-3 space-y-3">
                    {groupedLocations && Object.entries(groupedLocations).map(([type, locs]) => (
                      <div key={type}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{type}s</p>
                        <div className="flex flex-wrap gap-2">
                          {locs?.map((loc) => (
                            <Badge
                              key={loc.id}
                              variant={formData.selectedLocations.includes(loc.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newLocations = formData.selectedLocations.includes(loc.id)
                                  ? formData.selectedLocations.filter(id => id !== loc.id)
                                  : [...formData.selectedLocations, loc.id];
                                setFormData({ ...formData, selectedLocations: newLocations });
                              }}
                            >
                              {loc.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{formData.selectedLocations.length} locations selected</p>
                </div>

                <div className="space-y-3">
                  <Label>Specialisms</Label>
                  <p className="text-sm text-muted-foreground">Select all fostering specialisms this agency offers</p>
                  <div className="flex flex-wrap gap-2">
                    {specialisms?.map((spec) => (
                      <Badge
                        key={spec.id}
                        variant={formData.selectedSpecialisms.includes(spec.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newSpecialisms = formData.selectedSpecialisms.includes(spec.id)
                            ? formData.selectedSpecialisms.filter(id => id !== spec.id)
                            : [...formData.selectedSpecialisms, spec.id];
                          setFormData({ ...formData, selectedSpecialisms: newSpecialisms });
                        }}
                      >
                        {spec.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{formData.selectedSpecialisms.length} specialisms selected</p>
                </div>

                <div className="space-y-3">
                  <Label>Acceptance Types</Label>
                  <p className="text-sm text-muted-foreground">What types of placements does this agency accept?</p>
                  <div className="flex flex-wrap gap-2">
                    {acceptanceTypeOptions.map((type) => (
                      <Badge
                        key={type}
                        variant={formData.acceptance_types.includes(type) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTypes = formData.acceptance_types.includes(type)
                            ? formData.acceptance_types.filter(t => t !== type)
                            : [...formData.acceptance_types, type];
                          setFormData({ ...formData, acceptance_types: newTypes });
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
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
              {currentStep < 3 ? (
                <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingAgency ? "Update Agency" : "Create Agency"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}