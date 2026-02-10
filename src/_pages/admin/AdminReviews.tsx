"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Search, Star, CheckCircle, XCircle, Clock, Eye, MessageSquare, Trash2, 
  Filter, RefreshCw, AlertCircle, Flag, ThumbsUp, ThumbsDown, Loader2,
  MoreHorizontal, Reply, Shield
} from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  rating: number;
  title: string | null;
  is_approved: boolean | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  admin_response: string | null;
  admin_response_at: string | null;
  source: string | null;
  created_at: string;
  agency_id: string;
  agencies?: { name: string; slug: string };
}

export default function AdminReviews() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();

  // Fetch all reviews with agency info
  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ["admin-reviews", statusFilter, ratingFilter],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*, agencies(name, slug)")
        .order("created_at", { ascending: false });

      if (statusFilter === "pending") {
        query = query.or("is_approved.is.null,is_approved.eq.false");
      } else if (statusFilter === "approved") {
        query = query.eq("is_approved", true);
      } else if (statusFilter === "featured") {
        query = query.eq("is_featured", true);
      }

      if (ratingFilter !== "all") {
        query = query.eq("rating", parseInt(ratingFilter));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });

  // Stats
  const stats = {
    total: reviews?.length || 0,
    pending: reviews?.filter(r => !r.is_approved).length || 0,
    approved: reviews?.filter(r => r.is_approved).length || 0,
    featured: reviews?.filter(r => r.is_featured).length || 0,
    avgRating: reviews?.length 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
      : "0.0",
  };

  // Approve review
  const approveMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true, moderated_at: new Date().toISOString() })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review approved");
    },
    onError: () => toast.error("Failed to approve review"),
  });

  // Reject/unapprove review
  const rejectMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: false, moderated_at: new Date().toISOString() })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review rejected");
    },
    onError: () => toast.error("Failed to reject review"),
  });

  // Toggle featured
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ reviewId, isFeatured }: { reviewId: string; isFeatured: boolean }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_featured: isFeatured })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review updated");
    },
    onError: () => toast.error("Failed to update review"),
  });

  // Toggle verified
  const toggleVerifiedMutation = useMutation({
    mutationFn: async ({ reviewId, isVerified }: { reviewId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_verified: isVerified })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review verification updated");
    },
    onError: () => toast.error("Failed to update review"),
  });

  // Add admin response
  const respondMutation = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ 
          admin_response: response,
          admin_response_at: new Date().toISOString()
        })
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsDialogOpen(false);
      setAdminResponse("");
      toast.success("Response added");
    },
    onError: () => toast.error("Failed to add response"),
  });

  // Delete review
  const deleteMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  // Bulk approve pending
  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      const pendingIds = reviews?.filter(r => !r.is_approved).map(r => r.id) || [];
      if (pendingIds.length === 0) return;
      
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true, moderated_at: new Date().toISOString() })
        .in("id", pendingIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("All pending reviews approved");
    },
    onError: () => toast.error("Failed to approve reviews"),
  });

  const filteredReviews = reviews?.filter((review) =>
    review.author_name.toLowerCase().includes(search.toLowerCase()) ||
    review.content.toLowerCase().includes(search.toLowerCase()) ||
    review.agencies?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter by tab
  const displayedReviews = filteredReviews?.filter(review => {
    if (activeTab === "pending") return !review.is_approved;
    if (activeTab === "approved") return review.is_approved;
    if (activeTab === "featured") return review.is_featured;
    return true;
  });

  const openReviewDialog = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.admin_response || "");
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <SuperAdminSidebar title="Reviews" description="Manage and moderate all agency reviews">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
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
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.featured}</p>
                  <p className="text-xs text-muted-foreground">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card with Tabs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  {displayedReviews?.length || 0} reviews shown
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                {stats.pending > 0 && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (confirm(`Approve all ${stats.pending} pending reviews?`)) {
                        bulkApproveMutation.mutate();
                      }
                    }}
                    disabled={bulkApproveMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve All Pending
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                  {stats.pending > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                      {stats.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="featured" className="gap-2">
                  <Star className="w-4 h-4" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  All Reviews
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by author, content, or agency..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : displayedReviews && displayedReviews.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <p className="font-medium">{review.author_name}</p>
                            {review.title && (
                              <p className="text-sm font-medium text-muted-foreground truncate">
                                "{review.title}"
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {review.content}
                            </p>
                            {review.admin_response && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                                <Reply className="w-3 h-3" />
                                Response added
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="truncate max-w-[150px] font-medium">
                            {review.agencies?.name || "Unknown"}
                          </p>
                          {review.source && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {review.source}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {review.is_approved ? (
                              <Badge className="bg-green-100 text-green-700">Approved</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                            )}
                            {review.is_featured && (
                              <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
                            )}
                            {review.is_verified && (
                              <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), "MMM d, yyyy")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openReviewDialog(review)}
                              title="View & Respond"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!review.is_approved ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => approveMutation.mutate(review.id)}
                                title="Approve"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rejectMutation.mutate(review.id)}
                                title="Reject"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFeaturedMutation.mutate({ 
                                reviewId: review.id, 
                                isFeatured: !review.is_featured 
                              })}
                              title={review.is_featured ? "Unfeature" : "Feature"}
                              className={review.is_featured ? "text-purple-600" : "text-muted-foreground"}
                            >
                              <Star className={`w-4 h-4 ${review.is_featured ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleVerifiedMutation.mutate({ 
                                reviewId: review.id, 
                                isVerified: !review.is_verified 
                              })}
                              title={review.is_verified ? "Unverify" : "Verify"}
                              className={review.is_verified ? "text-blue-600" : "text-muted-foreground"}
                            >
                              <Shield className={`w-4 h-4 ${review.is_verified ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this review?")) {
                                  deleteMutation.mutate(review.id);
                                }
                              }}
                              title="Delete"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review for {selectedReview?.agencies?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Review Info */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">{selectedReview.author_name}</p>
                    {selectedReview.author_email && (
                      <p className="text-sm text-muted-foreground">{selectedReview.author_email}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedReview.created_at), "PPP 'at' p")}
                    </p>
                  </div>
                  {renderStars(selectedReview.rating, "md")}
                </div>

                {selectedReview.title && (
                  <div>
                    <Label className="text-muted-foreground">Title</Label>
                    <p className="font-medium text-lg">"{selectedReview.title}"</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Review Content</Label>
                  <p className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap">{selectedReview.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedReview.is_approved ? "default" : "secondary"}>
                    {selectedReview.is_approved ? "Approved" : "Pending"}
                  </Badge>
                  {selectedReview.is_featured && (
                    <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
                  )}
                  {selectedReview.is_verified && (
                    <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                  )}
                  {selectedReview.source && (
                    <Badge variant="outline">{selectedReview.source}</Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {!selectedReview.is_approved ? (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        approveMutation.mutate(selectedReview.id);
                        setSelectedReview({ ...selectedReview, is_approved: true });
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        rejectMutation.mutate(selectedReview.id);
                        setSelectedReview({ ...selectedReview, is_approved: false });
                      }}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toggleFeaturedMutation.mutate({ 
                        reviewId: selectedReview.id, 
                        isFeatured: !selectedReview.is_featured 
                      });
                      setSelectedReview({ ...selectedReview, is_featured: !selectedReview.is_featured });
                    }}
                  >
                    <Star className={`w-4 h-4 mr-2 ${selectedReview.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {selectedReview.is_featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toggleVerifiedMutation.mutate({ 
                        reviewId: selectedReview.id, 
                        isVerified: !selectedReview.is_verified 
                      });
                      setSelectedReview({ ...selectedReview, is_verified: !selectedReview.is_verified });
                    }}
                  >
                    <Shield className={`w-4 h-4 mr-2 ${selectedReview.is_verified ? "fill-blue-400 text-blue-400" : ""}`} />
                    {selectedReview.is_verified ? "Unverify" : "Verify"}
                  </Button>
                </div>
              </div>

              {/* Admin Response */}
              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="adminResponse">Admin Response (Public)</Label>
                <Textarea
                  id="adminResponse"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Add a public response to this review..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This response will be publicly visible below the review.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedReview) {
                  respondMutation.mutate({ 
                    reviewId: selectedReview.id, 
                    response: adminResponse 
                  });
                }
              }}
              disabled={respondMutation.isPending}
            >
              {respondMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Reply className="w-4 h-4 mr-2" />
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminSidebar>
  );
}