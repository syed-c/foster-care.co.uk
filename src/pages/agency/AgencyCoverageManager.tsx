import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MapPin,
  Search,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  Globe,
  Building2,
  Map as MapIcon,
  Loader2,
  Save,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent_id: string | null;
}

interface LocationNode extends Location {
  children: LocationNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
}

export default function AgencyCoverageManager() {
  const { agency } = useOutletContext<ContextType>();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch all locations
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["all-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as Location[];
    },
  });

  // Fetch current agency locations
  const { data: agencyLocations, isLoading: agencyLocationsLoading } = useQuery({
    queryKey: ["agency-locations", agency?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_locations")
        .select("location_id, is_primary")
        .eq("agency_id", agency?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!agency?.id,
  });

  // Initialize selected locations from database
  useEffect(() => {
    if (agencyLocations && selectedLocations.size === 0 && !hasChanges) {
      const initialSelected = new Set(agencyLocations.map(al => al.location_id));
      if (initialSelected.size > 0) {
        setSelectedLocations(initialSelected);
      }
    }
  }, [agencyLocations]);

  // Build location tree
  const locationTree = useMemo(() => {
    if (!locations) return [];

    const locationMap = new Map<string, LocationNode>();
    locations.forEach(loc => {
      locationMap.set(loc.id, { ...loc, children: [] });
    });

    const roots: LocationNode[] = [];
    locations.forEach(loc => {
      const node = locationMap.get(loc.id)!;
      if (loc.parent_id && locationMap.has(loc.parent_id)) {
        locationMap.get(loc.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort children by name
    const sortChildren = (nodes: LocationNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(node => sortChildren(node.children));
    };
    sortChildren(roots);

    return roots;
  }, [locations]);

  // Filter locations by search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locationTree;

    const matchesSearch = (node: LocationNode): boolean => {
      const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const childMatches = node.children.some(child => matchesSearch(child));
      return matches || childMatches;
    };

    const filterTree = (nodes: LocationNode[]): LocationNode[] => {
      return nodes
        .filter(matchesSearch)
        .map(node => ({
          ...node,
          children: filterTree(node.children),
        }));
    };

    return filterTree(locationTree);
  }, [locationTree, searchQuery]);

  // Selected locations with details
  const selectedLocationDetails = useMemo(() => {
    if (!locations) return [];
    return locations.filter(loc => selectedLocations.has(loc.id));
  }, [locations, selectedLocations]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Delete existing
      await supabase
        .from("agency_locations")
        .delete()
        .eq("agency_id", agency.id);

      // Insert new
      if (selectedLocations.size > 0) {
        const inserts = Array.from(selectedLocations).map((locationId, index) => ({
          agency_id: agency.id,
          location_id: locationId,
          is_primary: index === 0,
        }));
        const { error } = await supabase.from("agency_locations").insert(inserts);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Coverage areas saved successfully");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["agency-locations"] });
    },
    onError: () => {
      toast.error("Failed to save coverage areas");
    },
  });

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedLocations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLocations(newSelected);
    setHasChanges(true);
  };

  const selectAll = (node: LocationNode) => {
    const newSelected = new Set(selectedLocations);
    const addAll = (n: LocationNode) => {
      newSelected.add(n.id);
      n.children.forEach(addAll);
    };
    addAll(node);
    setSelectedLocations(newSelected);
    setHasChanges(true);
  };

  const deselectAll = (node: LocationNode) => {
    const newSelected = new Set(selectedLocations);
    const removeAll = (n: LocationNode) => {
      newSelected.delete(n.id);
      n.children.forEach(removeAll);
    };
    removeAll(node);
    setSelectedLocations(newSelected);
    setHasChanges(true);
  };

  const removeLocation = (id: string) => {
    const newSelected = new Set(selectedLocations);
    newSelected.delete(id);
    setSelectedLocations(newSelected);
    setHasChanges(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "country":
        return Globe;
      case "region":
        return MapIcon;
      default:
        return MapPin;
    }
  };

  const renderLocationNode = (node: LocationNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedLocations.has(node.id);
    const hasChildren = node.children.length > 0;
    const TypeIcon = getTypeIcon(node.type);

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-accent cursor-pointer",
            isSelected && "bg-primary/5"
          )}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-0.5 rounded hover:bg-accent"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelect(node.id)}
            className="data-[state=checked]:bg-primary"
          />

          <TypeIcon className="w-4 h-4 text-muted-foreground" />
          
          <span
            className={cn(
              "flex-1 text-sm",
              isSelected && "font-medium"
            )}
            onClick={() => toggleSelect(node.id)}
          >
            {node.name}
          </span>

          <Badge variant="outline" className="text-[10px] rounded-full">
            {node.type}
          </Badge>

          {hasChildren && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  selectAll(node);
                }}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  deselectAll(node);
                }}
              >
                None
              </Button>
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderLocationNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const isLoading = locationsLoading || agencyLocationsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Coverage Areas</h1>
          <p className="text-muted-foreground">
            Select the locations where your agency operates
          </p>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
          className="rounded-full"
        >
          {saveMutation.isPending ? (
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Location Selector */}
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Select Locations</CardTitle>
            <CardDescription>
              Choose countries, regions, cities, or specific areas you serve
            </CardDescription>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-1">
                  {filteredLocations.map(node => renderLocationNode(node))}
                </div>
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No locations found</p>
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Selected Locations */}
        <Card className="rounded-2xl h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-verified" />
              Selected Areas
              <Badge variant="secondary" className="rounded-full ml-auto">
                {selectedLocations.size}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLocationDetails.length > 0 ? (
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {selectedLocationDetails.map((loc, index) => {
                    const TypeIcon = getTypeIcon(loc.type);
                    return (
                      <div
                        key={loc.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent/50"
                      >
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 text-sm truncate">{loc.name}</span>
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] rounded-full">
                            Primary
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeLocation(loc.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  No locations selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Select locations from the list to define your coverage area
                </p>
              </div>
            )}

            {hasChanges && (
              <div className="mt-4 p-3 rounded-lg bg-warm/10 border border-warm/20">
                <p className="text-xs text-warm font-medium">
                  You have unsaved changes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
