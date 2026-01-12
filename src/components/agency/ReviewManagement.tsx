import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { updateAgencyReviewStats } from "@/lib/reviewUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Check, X, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  author_name: string;
  title: string;
  content: string;
  rating: number;
  is_approved: boolean;
  is_featured: boolean;
  admin_response?: string;
  created_at: string;
}

interface ReviewManagementProps {
  agencyId: string;
}

export const ReviewManagement = ({ agencyId }: ReviewManagementProps) => {
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    author_name: "",
    title: "",
    content: "",
    rating: 5,
  });

  // Fetch reviews for this agency
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["agency-reviews", agencyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  // Mutation to add a new review
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const { error } = await supabase
        .from("reviews")
        .insert([{ 
          ...reviewData,
          agency_id: agencyId,
          is_approved: true, // Auto-approve reviews added by agency owner
        }]);
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["agency-reviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      setNewReview({ author_name: "", title: "", content: "", rating: 5 });
      toast.success("Review added successfully!");
    },
    onError: (error) => {
      console.error("Error adding review:", error);
      toast.error("Failed to add review. Please try again.");
    },
  });

  // Mutation to update a review
  const updateReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const { error } = await supabase
        .from("reviews")
        .update(reviewData)
        .eq("id", reviewData.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["agency-reviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      setEditingReview(null);
      toast.success("Review updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    },
  });

  // Mutation to delete a review
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["agency-reviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      toast.success("Review deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    },
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReviewMutation.mutate(newReview);
  };

  const handleUpdateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateReviewMutation.mutate(editingReview);
    }
  };

  const handleApproveReview = async (reviewId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: approve })
        .eq("id", reviewId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["agency-reviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      toast.success(`Review ${approve ? 'approved' : 'unapproved'} successfully!`);
    } catch (error) {
      console.error("Error updating review approval:", error);
      toast.error(`Failed to ${approve ? 'approve' : 'unapprove'} review. Please try again.`);
    }
  };

  const handleToggleFeatured = async (reviewId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_featured: featured })
        .eq("id", reviewId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["agency-reviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      toast.success(`Review ${featured ? 'featured' : 'unfeatured'} successfully!`);
    } catch (error) {
      console.error("Error updating review featured status:", error);
      toast.error(`Failed to ${featured ? 'feature' : 'unfeature'} review. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Review Form */}
      <Card className="bg-[#1a2228] text-white hover:bg-card hover:text-foreground transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5" />
            Add Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author_name" className="text-white">Author Name *</Label>
                <Input
                  id="author_name"
                  value={newReview.author_name}
                  onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                  required
                  className="text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Rating *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        star <= newReview.rating
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#1a2228] text-white"
                      }`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">Review Content *</Label>
              <Textarea
                id="content"
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                rows={3}
                required
                className="text-white placeholder:text-white/50"
              />
            </div>
            <Button type="submit" disabled={addReviewMutation.isPending}>
              {addReviewMutation.isPending ? "Adding..." : "Add Review"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="bg-[#1a2228] text-white hover:bg-card hover:text-foreground transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reviews ({reviews?.length || 0})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl border bg-card">
                  {editingReview?.id === review.id ? (
                    // Edit form
                    <form onSubmit={handleUpdateReview} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit_author_name" className="text-white">Author Name</Label>
                          <Input
                            id="edit_author_name"
                            value={editingReview.author_name}
                            onChange={(e) => setEditingReview({ ...editingReview, author_name: e.target.value })}
                            className="text-white placeholder:text-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Rating</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                  star <= (editingReview.rating || 0)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-[#1a2228] text-white"
                                }`}
                                onClick={() => setEditingReview({ ...editingReview, rating: star })}
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_title" className="text-white">Title</Label>
                        <Input
                          id="edit_title"
                          value={editingReview.title}
                          onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                          className="text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_content" className="text-white">Review Content</Label>
                        <Textarea
                          id="edit_content"
                          value={editingReview.content}
                          onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                          rows={3}
                          className="text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReview(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // Review display
                    <>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.author_name}</span>
                        </div>
                        <div className="flex gap-2">
                          {review.is_approved ? (
                            <Badge variant="default">Approved</Badge>
                          ) : (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                          {review.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-medium mb-1">{review.title}</h4>
                      )}
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                      {review.admin_response && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground font-medium">Admin Response</p>
                          <p className="text-sm text-muted-foreground">{review.admin_response}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReview(review)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveReview(review.id, !review.is_approved)}
                        >
                          {review.is_approved ? (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Unapprove
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(review.id, !review.is_featured)}
                        >
                          {review.is_featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteReviewMutation.mutate(review.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};