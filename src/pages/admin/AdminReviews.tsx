import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Star, CheckCircle, XCircle, Clock, Eye, MessageSquare, Trash2, Filter } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  title: string | null;
  is_approved: boolean | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  admin_response: string | null;
  created_at: string;
  agency_id: string;
  agencies?: { name: string; slug: string };
}

export default function AdminReviews() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all reviews with agency info
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*, agencies(name, slug)")
        .order("created_at", { ascending: false });

      if (statusFilter === "pending") {
        query = query.eq("is_approved", false);
      } else if (statusFilter === "approved") {
        query = query.eq("is_approved", true);
      } else if (statusFilter === "featured") {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });

  // Approve review
  const approveMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true })
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
        .update({ is_approved: false })
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

  // Add admin response
  const respondMutation = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ admin_response: response })
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

  const filteredReviews = reviews?.filter((review) =>
    review.author_name.toLowerCase().includes(search.toLowerCase()) ||
    review.content.toLowerCase().includes(search.toLowerCase()) ||
    review.agencies?.name.toLowerCase().includes(search.toLowerCase())
  );

  const openReviewDialog = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.admin_response || "");
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Reviews" description="Manage and moderate all agency reviews">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>
                {filteredReviews?.length || 0} reviews total
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredReviews && filteredReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.author_name}</p>
                          {review.title && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {review.title}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-[150px]">{review.agencies?.name || "Unknown"}</p>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {review.is_approved ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" /> Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          )}
                          {review.is_featured && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              <Star className="w-3 h-3 mr-1" /> Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
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
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => rejectMutation.mutate(review.id)}
                              title="Reject"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <XCircle className="w-4 h-4" />
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
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          )}
        </CardContent>
      </Card>

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
                    <p className="font-medium">{selectedReview.author_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedReview.created_at), "PPP")}
                    </p>
                  </div>
                  {renderStars(selectedReview.rating)}
                </div>

                {selectedReview.title && (
                  <div>
                    <Label className="text-muted-foreground">Title</Label>
                    <p className="font-medium">{selectedReview.title}</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Review Content</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedReview.content}</p>
                </div>

                <div className="flex gap-2">
                  <Badge variant={selectedReview.is_approved ? "default" : "secondary"}>
                    {selectedReview.is_approved ? "Approved" : "Pending"}
                  </Badge>
                  {selectedReview.is_featured && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">Featured</Badge>
                  )}
                  {selectedReview.is_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Verified</Badge>
                  )}
                </div>
              </div>

              {/* Admin Response */}
              <div className="space-y-3 pt-4 border-t">
                <Label htmlFor="adminResponse">Admin Response</Label>
                <Textarea
                  id="adminResponse"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Add a public response to this review..."
                  rows={4}
                />
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
              <MessageSquare className="w-4 h-4 mr-2" />
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
