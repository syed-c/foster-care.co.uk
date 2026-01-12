import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { updateAgencyReviewStats } from "@/lib/reviewUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  agencyId: string;
  agencyName: string;
}

export const ReviewForm = ({ agencyId, agencyName }: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    author_name: "",
    title: "",
    content: "",
    rating: 5,
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const { error } = await supabase
        .from("reviews")
        .insert([{ 
          ...reviewData,
          agency_id: agencyId,
          is_approved: false, // Reviews need admin approval
        }]);
      if (error) throw error;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["agencyReviews", agencyId] });
      queryClient.invalidateQueries({ queryKey: ["agency", agencyId] }); // Also invalidate agency data to refresh stats
      
      // Update agency stats
      await updateAgencyReviewStats(agencyId);
      
      setFormData({ author_name: "", title: "", content: "", rating: 5 });
      toast.success("Review submitted successfully! It will be reviewed and published soon.");
    },
    onError: (error) => {
      console.error("Error adding review:", error);
      toast.error("Failed to submit review. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.content) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addReviewMutation.mutate(formData);
  };

  return (
    <Card className="bg-card text-foreground hover:bg-card hover:text-foreground transition-colors duration-300 border border-border/50 shadow-sm rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-foreground">Rate {agencyName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author_name" className="text-foreground">Your Name *</Label>
            <Input
              id="author_name"
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              placeholder="Enter your name"
              required
              className="text-foreground placeholder:text-foreground/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-foreground">Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    star <= formData.rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  <Star className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Review Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief summary of your experience"
              className="text-foreground placeholder:text-foreground/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">Your Review *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your experience with this agency..."
              rows={4}
              required
              className="text-foreground placeholder:text-foreground/50"
            />
          </div>
          
          <Button type="submit" disabled={addReviewMutation.isPending}>
            {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};