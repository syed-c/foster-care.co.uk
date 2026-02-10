"use client";
import { useState, useMemo } from "react";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MapPin, Building2, Edit, Trash2, MoreHorizontal, 
  Eye, ChevronRight, Globe, Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type Location = {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent_id: string | null;
  is_active: boolean | null;
  agency_count: number | null;
  population: number | null;
  seo_title: string | null;
  seo_description: string | null;
  description: string | null;
  created_at: string | null;
};

const locationTypes = [
  { value: "country", label: "Country" },
  { value: "region", label: "Region" },
  { value: "county", label: "County" },
  { value: "city", label: "City" },
  { value: "town", label: "Town" },
];

export default function AdminLocationsNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [parentFilter, setParentFilter] = useState("all");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { data: locations, isLoading, refetch } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Location[];
    },
  });

  const parentLocations = useMemo(() => {
    return locations?.filter(l => l.type === "country" || l.type === "region" || l.type === "county") || [];
  }, [locations]);

  const updateLocation = useMutation({
    mutationFn: async (updates: Partial<Location> & { id: string }) => {
      const { error } = await supabase
        .from("locations")
        .update(updates)
        .eq("id", updates.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location updated successfully" });
      setIsDialogOpen(false);
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast({ title: "Error updating location", description: error.message, variant: "destructive" });
    },
  });

  const createLocation = useMutation({
    mutationFn: async (data: Omit<Location, "id" | "created_at">) => {
      const { error } = await supabase.from("locations").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location created successfully" });
      setIsDialogOpen(false);
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast({ title: "Error creating location", description: error.message, variant: "destructive" });
    },
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting location", description: error.message, variant: "destructive" });
    },
  });

  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    return locations.filter((location) => {
      const matchesSearch = location.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || location.type === typeFilter;
      const matchesParent = parentFilter === "all" || location.parent_id === parentFilter;
      return matchesSearch && matchesType && matchesParent;
    });
  }, [locations, search, typeFilter, parentFilter]);

  const getParentName = (parentId: string | null) => {
    if (!parentId || !locations) return "—";
    const parent = locations.find(l => l.id === parentId);
    return parent?.name || "—";
  };

  const columns = [
    {
      key: "name",
      header: "Location",
      render: (location: Location) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-verified/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-verified" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{location.name}</p>
            <p className="text-xs text-muted-foreground truncate">/{location.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (location: Location) => (
        <Badge variant="outline" className="rounded-full capitalize text-xs">
          {location.type}
        </Badge>
      ),
    },
    {
      key: "parent",
      header: "Parent",
      render: (location: Location) => (
        <span className="text-sm text-muted-foreground">{getParentName(location.parent_id)}</span>
      ),
    },
    {
      key: "agencies",
      header: "Agencies",
      render: (location: Location) => (
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{location.agency_count || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (location: Location) => (
        <Badge 
          className={`rounded-full text-xs ${
            location.is_active 
              ? "bg-verified/10 text-verified border-verified/20" 
              : "bg-muted text-muted-foreground"
          }`}
        >
          {location.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      render: (location: Location) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl bg-popover">
            <DropdownMenuItem 
              onClick={() => window.open(`/fostering/${location.slug}`, "_blank")}
              className="rounded-lg"
            >
              <Eye className="w-4 h-4 mr-2" /> View Page
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => { setEditingLocation(location); setIsDialogOpen(true); }}
              className="rounded-lg"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLocation.mutate({ id: location.id, is_active: !location.is_active })}
              className="rounded-lg"
            >
              <Globe className="w-4 h-4 mr-2" /> 
              {location.is_active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => { if (confirm("Delete this location?")) deleteLocation.mutate(location.id); }}
              className="rounded-lg text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filters = [
    {
      key: "type",
      label: "Type",
      options: [
        { value: "all", label: "All Types" },
        ...locationTypes,
      ],
      value: typeFilter,
      onChange: setTypeFilter,
    },
    {
      key: "parent",
      label: "Parent",
      options: [
        { value: "all", label: "All Parents" },
        ...parentLocations.map(l => ({ value: l.id, label: l.name })),
      ],
      value: parentFilter,
      onChange: setParentFilter,
    },
  ];

  const typeCounts = useMemo(() => {
    if (!locations) return {};
    return locations.reduce((acc, loc) => {
      acc[loc.type] = (acc[loc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [locations]);

  return (
    <SuperAdminSidebar title="Locations" description="Manage all UK locations and SEO pages">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-2xl font-bold">{locations?.length || 0}</p>
          <p className="text-xs text-muted-foreground">Total Locations</p>
        </div>
        {locationTypes.slice(0, 4).map(type => (
          <div key={type.value} className="bg-card rounded-2xl border border-border p-4">
            <p className="text-2xl font-bold">{typeCounts[type.value] || 0}</p>
            <p className="text-xs text-muted-foreground">{type.label}s</p>
          </div>
        ))}
      </div>

      <DataTable
        data={filteredLocations}
        columns={columns}
        filters={filters}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search locations..."
        onAdd={() => { setEditingLocation(null); setCurrentStep(1); setIsDialogOpen(true); }}
        addLabel="Add Location"
        onRefresh={() => refetch()}
        isLoading={isLoading}
        rowKey={(location) => location.id}
        emptyState={
          <div className="text-center">
            <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="font-medium">No locations found</p>
            <p className="text-sm text-muted-foreground">Add UK locations to create SEO pages</p>
          </div>
        }
      />

      {/* Multi-Step Location Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setCurrentStep(1); }}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              {editingLocation 
                ? "Update location details and SEO settings" 
                : `Step ${currentStep} of 3`
              }
            </DialogDescription>
          </DialogHeader>
          
          {/* Step Indicator */}
          {!editingLocation && (
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <LocationForm
            location={editingLocation}
            parentLocations={parentLocations}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={(data) => {
              if (editingLocation) {
                updateLocation.mutate({ ...data, id: editingLocation.id } as any);
              } else {
                createLocation.mutate(data as any);
              }
            }}
            onCancel={() => { setIsDialogOpen(false); setCurrentStep(1); }}
          />
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}

function LocationForm({ 
  location, 
  parentLocations,
  currentStep,
  onStepChange,
  onSubmit, 
  onCancel 
}: { 
  location: Location | null;
  parentLocations: Location[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: Partial<Location>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: location?.name || "",
    slug: location?.slug || "",
    type: location?.type || "city",
    parent_id: location?.parent_id || null,
    is_active: location?.is_active ?? true,
    population: location?.population || null,
    description: location?.description || "",
    seo_title: location?.seo_title || "",
    seo_description: location?.seo_description || "",
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: location ? formData.slug : generateSlug(name),
      seo_title: location ? formData.seo_title : `Fostering Agencies in ${name} | Foster Care UK`,
    });
  };

  // For edit mode, show all fields at once
  if (location) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Location Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Manchester"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>URL Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
              placeholder="manchester"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Location Type</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-popover">
                {locationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Parent Location</Label>
            <Select 
              value={formData.parent_id || "none"} 
              onValueChange={(v) => setFormData({ ...formData, parent_id: v === "none" ? null : v })}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select parent..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-popover">
                <SelectItem value="none">No Parent</SelectItem>
                {parentLocations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name} ({loc.type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this location..."
            className="rounded-xl min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input
            value={formData.seo_title}
            onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
            placeholder="Fostering Agencies in Manchester..."
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea
            value={formData.seo_description}
            onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
            placeholder="Find verified fostering agencies..."
            className="rounded-xl min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <Label>Active</Label>
            <p className="text-xs text-muted-foreground">Location page is live</p>
          </div>
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
          <Button onClick={() => onSubmit(formData)} className="rounded-xl">Save Location</Button>
        </div>
      </div>
    );
  }

  // Multi-step for create mode
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Location Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Manchester"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                placeholder="manchester"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Will create: /fostering/{formData.slug || "your-location"}
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Location Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover">
                  {locationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Parent Location</Label>
              <Select 
                value={formData.parent_id || "none"} 
                onValueChange={(v) => setFormData({ ...formData, parent_id: v === "none" ? null : v })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select parent..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-popover">
                  <SelectItem value="none">No Parent</SelectItem>
                  {parentLocations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name} ({loc.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                className="rounded-xl min-h-[80px]"
              />
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Fostering Agencies in Manchester..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Find verified fostering agencies..."
                className="rounded-xl min-h-[80px]"
              />
            </div>
            
            {/* SEO Preview */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-xs text-muted-foreground mb-2">Search Preview</p>
              <p className="text-blue-600 font-medium text-sm truncate">
                {formData.seo_title || `Fostering Agencies in ${formData.name}`}
              </p>
              <p className="text-green-700 text-xs">fostercare.uk/fostering/{formData.slug}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {formData.seo_description || `Find verified fostering agencies in ${formData.name}. Compare services and connect with local agencies.`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={() => currentStep > 1 ? onStepChange(currentStep - 1) : onCancel()} 
          className="rounded-xl"
        >
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        {currentStep < 3 ? (
          <Button 
            onClick={() => onStepChange(currentStep + 1)} 
            className="rounded-xl"
            disabled={currentStep === 1 && !formData.name}
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={() => onSubmit(formData)} className="rounded-xl">
            Create Location
          </Button>
        )}
      </div>
    </div>
  );
}
