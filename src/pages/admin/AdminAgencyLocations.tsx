import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, MapPin, Building2, Loader2 } from "lucide-react";

interface AgencyLocation {
  id: string;
  agency_id: string;
  location_id: string;
  is_primary: boolean;
  created_at: string;
  agency: { id: string; name: string; city: string | null } | null;
  location: { id: string; name: string; type: string; slug: string } | null;
}

const AdminAgencyLocations = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [filterAgency, setFilterAgency] = useState<string>("all");

  // Fetch agency-location relationships
  const { data: agencyLocations, isLoading: isLoadingRelations } = useQuery({
    queryKey: ["admin-agency-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_locations")
        .select(`
          id,
          agency_id,
          location_id,
          is_primary,
          created_at,
          agency:agencies(id, name, city),
          location:locations(id, name, type, slug)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as AgencyLocation[];
    },
  });

  // Fetch all agencies
  const { data: agencies } = useQuery({
    queryKey: ["admin-all-agencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id, name, city")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch all locations
  const { data: locations } = useQuery({
    queryKey: ["admin-all-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, type, slug, parent_id")
        .order("type")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Add relationship mutation
  const addRelationMutation = useMutation({
    mutationFn: async (newRelation: {
      agency_id: string;
      location_id: string;
      is_primary: boolean;
    }) => {
      const { error } = await supabase
        .from("agency_locations")
        .insert(newRelation);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agency-locations"] });
      toast.success("Agency-location relationship added");
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add relationship: ${error.message}`);
    },
  });

  // Delete relationship mutation
  const deleteRelationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("agency_locations")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agency-locations"] });
      toast.success("Relationship removed");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove: ${error.message}`);
    },
  });

  const resetForm = () => {
    setSelectedAgency("");
    setSelectedLocation("");
    setIsPrimary(false);
    setIsAddDialogOpen(false);
  };

  const handleAdd = () => {
    if (!selectedAgency || !selectedLocation) {
      toast.error("Please select both agency and location");
      return;
    }
    addRelationMutation.mutate({
      agency_id: selectedAgency,
      location_id: selectedLocation,
      is_primary: isPrimary,
    });
  };

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      country: "Country",
      region: "Region",
      county: "County",
      city: "City",
    };
    return labels[type] || type;
  };

  const groupedLocations = locations?.reduce((acc, loc) => {
    const type = loc.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(loc);
    return acc;
  }, {} as Record<string, typeof locations>);

  const filteredRelations = agencyLocations?.filter(
    (rel) => filterAgency === "all" || rel.agency_id === filterAgency
  );

  return (
    <SuperAdminSidebar title="Agency Locations" description="Manage which locations agencies serve">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Relationship
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Agency-Location Mappings
              </CardTitle>
              <Select value={filterAgency} onValueChange={setFilterAgency}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  {agencies?.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingRelations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredRelations?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No agency-location relationships found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRelations?.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {rel.agency?.name || "Unknown"}
                            </div>
                            {rel.agency?.city && (
                              <div className="text-sm text-muted-foreground">
                                {rel.agency.city}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {rel.location?.name || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                          {getLocationTypeLabel(rel.location?.type || "")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {rel.is_primary ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">
                            Primary
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRelationMutation.mutate(rel.id)}
                          disabled={deleteRelationMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Relationship Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Agency-Location Relationship</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Agency</Label>
                <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies?.map((agency) => (
                      <SelectItem key={agency.id} value={agency.id}>
                        {agency.name}
                        {agency.city && ` (${agency.city})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupedLocations &&
                      Object.entries(groupedLocations).map(([type, locs]) => (
                        <div key={type}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                            {getLocationTypeLabel(type)}s
                          </div>
                          {locs?.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary"
                  checked={isPrimary}
                  onCheckedChange={(checked) => setIsPrimary(checked === true)}
                />
                <Label htmlFor="is_primary" className="cursor-pointer">
                  Set as primary location for this agency
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={addRelationMutation.isPending}
              >
                {addRelationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Relationship"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminSidebar>
  );
};

export default AdminAgencyLocations;
