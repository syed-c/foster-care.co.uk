import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  MapPin, 
  Search, 
  Building2, 
  Loader2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Key,
  RefreshCw
} from "lucide-react";

interface GmbLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  selected: boolean;
  place_id?: string; // Add place_id for detailed review fetching
}

const AdminGmbImport = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("fostering agency");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [locations, setLocations] = useState<GmbLocation[]>([]);
  const [importProgress, setImportProgress] = useState<{ total: number; completed: number } | null>(null);
  const [fetchReviewsProgress, setFetchReviewsProgress] = useState<{ total: number; completed: number } | null>(null);

  // Real search function using Supabase Functions
  const handleSearch = async () => {
    if (!searchQuery && !searchLocation) {
      toast.error("Please enter a search query or location");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('quick-processor', {
        body: {
          query: searchQuery,
          location: searchLocation,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      const results: GmbLocation[] = data.results.map((place: any) => ({
        id: place.id,
        name: place.name,
        address: place.address,
        phone: place.phone,
        website: place.website,
        rating: place.rating,
        reviewCount: place.reviewCount,
        selected: false,
        place_id: place.place_id, // Include place_id if available
      }));

      setLocations(results);
      
      if (results.length === 0) {
        toast.info("No locations found. Try different search terms.");
      } else {
        toast.success(`Found ${results.length} locations`);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || "Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleLocation = (id: string) => {
    setLocations(prev =>
      prev.map(loc =>
        loc.id === id ? { ...loc, selected: !loc.selected } : loc
      )
    );
  };

  const selectAll = () => {
    const allSelected = locations.every(loc => loc.selected);
    setLocations(prev => prev.map(loc => ({ ...loc, selected: !allSelected })));
  };

  const selectedCount = locations.filter(loc => loc.selected).length;

  const importMutation = useMutation({
    mutationFn: async (selectedLocations: GmbLocation[]) => {
      setImportProgress({ total: selectedLocations.length, completed: 0 });
      
      for (let i = 0; i < selectedLocations.length; i++) {
        const location = selectedLocations[i];
        
        // Create slug from name
        const slug = location.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const { error } = await supabase.from("agencies").insert({
          name: location.name,
          slug: `${slug}-${Date.now()}`,
          address: location.address,
          phone: location.phone || null,
          website: location.website || null,
          rating: location.rating || 0,
          review_count: location.reviewCount || 0,
          is_claimed: false,
          is_verified: false,
          is_featured: false,
          place_id: location.place_id || null, // Store the place_id for future review fetching
        });

        if (error) throw error;
        
        setImportProgress(prev => 
          prev ? { ...prev, completed: prev.completed + 1 } : null
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agencies"] });
      toast.success(`Successfully imported ${selectedCount} agencies`);
      setLocations(prev => prev.map(loc => ({ ...loc, selected: false })));
      setImportProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`Import failed: ${error.message}`);
      setImportProgress(null);
    },
  });

  const handleImport = () => {
    const selectedLocations = locations.filter(loc => loc.selected);
    if (selectedLocations.length === 0) {
      toast.error("Please select at least one location to import");
      return;
    }
    if (selectedLocations.length > 50) {
      toast.error("Maximum 50 locations can be imported at once");
      return;
    }
    importMutation.mutate(selectedLocations);
  };

  // New function to fetch detailed reviews for imported agencies
  const fetchDetailedReviews = async () => {
    try {
      // Get all imported agencies - we'll use the id to fetch reviews
      const { data: agencies, error } = await supabase
        .from('agencies')
        .select('id, name');

      if (error) throw error;

      if (!agencies || agencies.length === 0) {
        toast.info("No agencies found to fetch reviews for.");
        return;
      }

      const agenciesWithPlaceId = agencies as { id: string; name: string }[];
      setFetchReviewsProgress({ total: agenciesWithPlaceId.length, completed: 0 });

      for (let i = 0; i < agenciesWithPlaceId.length; i++) {
        const agency = agenciesWithPlaceId[i];
        
        try {
          // Call the edge function to fetch detailed reviews
          const { data: reviewData, error: reviewError } = await supabase.functions.invoke('fetch-place-reviews', {
            body: { agency_id: agency.id },
          });

          if (reviewError) throw reviewError;

          if (reviewData?.success && reviewData?.reviews && reviewData.reviews.length > 0) {
            // Insert the fetched reviews into the reviews table
            const reviewsToInsert = reviewData.reviews.map((review: any) => ({
              agency_id: agency.id,
              name: review.author_name,
              rating: review.rating,
              comment: review.text,
              created_at: new Date(review.time * 1000).toISOString(),
              is_approved: true,
              is_featured: false,
              source: 'google_places'
            }));

            if (reviewsToInsert.length > 0) {
              const { error: insertError } = await supabase
                .from('reviews')
                .insert(reviewsToInsert)
                .select();

              if (insertError) {
                console.error(`Failed to insert reviews for agency ${agency.id}:`, insertError);
              }
            }

            // Update the agency's rating with the one from Google Places
            if (reviewData.rating) {
              const { error: updateError } = await supabase
                .from('agencies')
                .update({
                  rating: reviewData.rating,
                  review_count: reviewData.user_ratings_total || 0
                })
                .eq('id', agency.id);

              if (updateError) {
                console.error(`Failed to update agency ${agency.id}:`, updateError);
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch reviews for agency ${agency.id}:`, error);
        }

        setFetchReviewsProgress(prev => 
          prev ? { ...prev, completed: prev.completed + 1 } : null
        );
      }

      toast.success(`Successfully fetched reviews for ${agenciesWithPlaceId.length} agencies`);
      setFetchReviewsProgress(null);
    } catch (error: any) {
      console.error('Fetch reviews error:', error);
      toast.error(`Failed to fetch reviews: ${error.message}`);
      setFetchReviewsProgress(null);
    }
  };

  return (
    <SuperAdminSidebar title="GMB Import" description="Import foster care agencies from Google My Business">
      <div className="space-y-6">
        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Google Places API Connected</p>
                <p className="text-muted-foreground">
                  Your API key is securely stored. Search for fostering agencies to import them as unclaimed listings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Locations
            </CardTitle>
            <CardDescription>
              Search for foster care agencies to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="searchQuery">Search Query</Label>
                <Input
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="foster care agency, fostering services..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchLocation">Location</Label>
                <Input
                  id="searchLocation"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="London, Manchester, UK..."
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search GMB
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Fetch Reviews Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Fetch Detailed Reviews
            </CardTitle>
            <CardDescription>
              Fetch detailed reviews for imported agencies using Google Places API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  This will fetch detailed reviews for all imported agencies that have a place_id. 
                  Reviews will be added to the agencies' profiles.
                </p>
              </div>
              <Button 
                onClick={fetchDetailedReviews}
                disabled={fetchReviewsProgress !== null}
                variant="secondary"
              >
                {fetchReviewsProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching: {fetchReviewsProgress.completed} / {fetchReviewsProgress.total}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Fetch All Reviews
                  </>
                )}
              </Button>
            </div>
            
            {fetchReviewsProgress && (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(fetchReviewsProgress.completed / fetchReviewsProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Card */}
        {locations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Search Results
                  </CardTitle>
                  <CardDescription>
                    {selectedCount} of {locations.length} selected (max 50)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={selectAll}>
                    {locations.every(loc => loc.selected) ? "Deselect All" : "Select All"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={handleImport}
                    disabled={selectedCount === 0 || importMutation.isPending}
                  >
                    {importMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Import Selected
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {importProgress && (
                <div className="mb-4 p-4 bg-primary/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                    <span className="font-medium">
                      Importing: {importProgress.completed} / {importProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(importProgress.completed / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        location.selected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleLocation(location.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={location.selected}
                          onCheckedChange={() => toggleLocation(location.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{location.name}</h4>
                            {location.rating && (
                              <Badge variant="secondary" className="text-xs">
                                ★ {location.rating} ({location.reviewCount})
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {location.address}
                          </p>
                          {location.phone && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {location.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-secondary/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Enter your Google Cloud API key with Places API enabled</li>
                  <li>Search for foster care agencies by name or location</li>
                  <li>Select up to 50 agencies to import at once</li>
                  <li>Imported agencies will appear as unclaimed in your agencies list</li>
                  <li>Use "Fetch All Reviews" to import detailed reviews after import</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminSidebar>
  );
};

export default AdminGmbImport;
