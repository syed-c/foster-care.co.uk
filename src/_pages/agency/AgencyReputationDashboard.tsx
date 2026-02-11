"use client";
import { useOutletContext } from "@/context/WorkspaceContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  ExternalLink,
  Copy,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

export default function AgencyReputationDashboard() {
  const { agency, workspace, user } = useOutletContext<ContextType>();

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ["agency-reviews", agency?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("agency_id", agency?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Fetch reputation events
  const { data: reputationEvents } = useQuery({
    queryKey: ["agency-reputation-events", agency?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reputation_events")
        .select("*")
        .eq("agency_id", agency?.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Calculate stats
  const totalReviews = reviews?.length || 0;
  const approvedReviews = reviews?.filter(r => r.is_approved).length || 0;
  const avgRating = agency?.rating || 0;
  const positiveReviews = reviews?.filter(r => r.rating >= 4).length || 0;
  const negativeReviews = reviews?.filter(r => r.rating <= 2).length || 0;
  const responseRate = totalReviews > 0 
    ? Math.round((reviews?.filter(r => r.admin_response).length || 0) / totalReviews * 100) 
    : 0;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews?.filter(r => r.rating === rating).length || 0,
    percentage: totalReviews > 0 
      ? Math.round((reviews?.filter(r => r.rating === rating).length || 0) / totalReviews * 100)
      : 0,
  }));

  // Feedback page URL
  const feedbackUrl = `${window.location.origin}/agencies/${agency?.slug}/feedback`;

  const copyFeedbackLink = () => {
    navigator.clipboard.writeText(feedbackUrl);
    toast.success("Feedback link copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reputation Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your agency's reputation</p>
        </div>
        <Button className="rounded-full" onClick={copyFeedbackLink}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Feedback Link
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalReviews}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-verified/10">
                <ThumbsUp className="w-5 h-5 text-verified" />
              </div>
              <div>
                <p className="text-2xl font-bold">{positiveReviews}</p>
                <p className="text-sm text-muted-foreground">Positive Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-soft">
          <CardContent className="pt-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-warm/10">
                <Clock className="w-5 h-5 text-warm" />
              </div>
              <div>
                <p className="text-2xl font-bold">{responseRate}%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card className="lg:col-span-1 rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="lg:col-span-2 rounded-2xl border-border shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Reviews</CardTitle>
                <CardDescription>Latest feedback from foster carers</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl border bg-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{review.author_name}</span>
                        {review.is_verified && (
                          <Badge variant="secondary" className="text-[10px]">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                  {review.admin_response && (
                    <div className="mt-3 p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
                      <p className="text-xs text-muted-foreground mb-1">Your response:</p>
                      <p className="text-sm">{review.admin_response}</p>
                    </div>
                  )}
                  {!review.admin_response && (
                    <Button variant="ghost" size="sm" className="mt-2 rounded-full text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Draft Response
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share your feedback link to start collecting reviews
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Page Promotion */}
      <Card className="rounded-2xl border-border shadow-soft bg-gradient-to-br from-primary/5 to-warm/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1">Branded Feedback Page</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Collect reviews with your own branded feedback page. Positive reviews go public, negative ones stay private for improvement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-xl border text-sm font-mono">
                  <span className="truncate max-w-[300px]">{feedbackUrl}</span>
                </div>
                <Button variant="outline" className="rounded-xl" onClick={copyFeedbackLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button className="rounded-xl" asChild>
                  <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reputation Activity */}
      {reputationEvents && reputationEvents.length > 0 && (
        <Card className="rounded-2xl border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Reputation Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reputationEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/50"
                >
                  <div className={`p-2 rounded-lg ${
                    event.sentiment === 'positive' ? 'bg-verified/10' :
                    event.sentiment === 'negative' ? 'bg-destructive/10' :
                    'bg-muted'
                  }`}>
                    {event.sentiment === 'positive' ? (
                      <ThumbsUp className="w-4 h-4 text-verified" />
                    ) : event.sentiment === 'negative' ? (
                      <ThumbsDown className="w-4 h-4 text-destructive" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{event.event_type.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
