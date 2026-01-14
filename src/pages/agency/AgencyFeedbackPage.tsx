import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Star, 
  Building2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Heart,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FeedbackStep = "rating" | "details" | "contact" | "submitted";

export default function AgencyFeedbackPage() {
  const { slug } = useParams<{ slug: string }>();
  const [step, setStep] = useState<FeedbackStep>("rating");
  const [formData, setFormData] = useState({
    overall_rating: 0,
    would_recommend: null as boolean | null,
    nps_score: null as number | null,
    communication_rating: 0,
    professionalism_rating: 0,
    support_rating: 0,
    positive_feedback: "",
    improvement_feedback: "",
    respondent_name: "",
    respondent_email: "",
    consent_public: false,
  });

  // Fetch agency by slug
  const { data: agency, isLoading, error } = useQuery({
    queryKey: ["agency-feedback", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("id, name, slug, logo_url, is_verified")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async () => {
      if (!agency) throw new Error("Agency not found");

      // Determine sentiment based on rating and recommendation
      const isPositive = formData.overall_rating >= 4 && formData.would_recommend === true;
      const sentiment = isPositive ? "positive" : formData.overall_rating <= 2 ? "negative" : "neutral";

      // Determine routing - positive goes public, negative goes to resolution
      const routedTo = isPositive && formData.consent_public ? "public" : "resolution";

      const { data, error } = await supabase
        .from("feedback_responses")
        .insert({
          agency_id: agency.id,
          overall_rating: formData.overall_rating,
          would_recommend: formData.would_recommend,
          nps_score: formData.nps_score,
          communication_rating: formData.communication_rating || null,
          professionalism_rating: formData.professionalism_rating || null,
          support_rating: formData.support_rating || null,
          positive_feedback: formData.positive_feedback || null,
          improvement_feedback: formData.improvement_feedback || null,
          respondent_name: formData.respondent_name || null,
          respondent_email: formData.respondent_email || null,
          consent_public: formData.consent_public,
          consent_logged_at: formData.consent_public ? new Date().toISOString() : null,
          sentiment,
          routed_to: routedTo,
          status: routedTo === "public" ? "approved" : "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // If negative/neutral, create a resolution thread
      if (routedTo === "resolution") {
        await supabase.from("resolution_threads").insert({
          agency_id: agency.id,
          feedback_response_id: data.id,
          status: "open",
          priority: formData.overall_rating <= 2 ? "high" : "medium",
        });
      }

      return { sentiment, routedTo };
    },
    onSuccess: () => {
      setStep("submitted");
      toast.success("Thank you for your feedback!");
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    },
  });

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, overall_rating: rating });
  };

  const handleNext = () => {
    if (step === "rating" && formData.overall_rating > 0) {
      setStep("details");
    } else if (step === "details") {
      setStep("contact");
    } else if (step === "contact") {
      submitFeedbackMutation.mutate();
    }
  };

  const handleBack = () => {
    if (step === "details") setStep("rating");
    else if (step === "contact") setStep("details");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Agency Not Found</h1>
        <p className="text-muted-foreground mb-6">This feedback page doesn't exist.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const isPositiveSentiment = formData.overall_rating >= 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-2xl mx-auto px-4 py-8 md:py-16">
        {/* Agency Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {agency.logo_url ? (
              <img
                src={agency.logo_url}
                alt={agency.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1">{agency.name}</h1>
          <p className="text-muted-foreground">We value your feedback</p>
        </div>

        {/* Progress Indicator */}
        {step !== "submitted" && (
          <div className="flex justify-center gap-2 mb-8">
            {["rating", "details", "contact"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  step === s ? "bg-primary" : 
                  ["rating", "details", "contact"].indexOf(step) > i ? "bg-primary/50" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Rating */}
          {step === "rating" && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle>How would you rate your experience?</CardTitle>
                  <CardDescription>
                    Your honest feedback helps us improve
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Star Rating */}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110",
                          star <= formData.overall_rating
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Star className={cn("w-6 h-6", star <= formData.overall_rating && "fill-current")} />
                      </button>
                    ))}
                  </div>

                  {formData.overall_rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-lg font-medium">
                        {formData.overall_rating === 5 ? "Excellent!" :
                         formData.overall_rating === 4 ? "Great!" :
                         formData.overall_rating === 3 ? "Good" :
                         formData.overall_rating === 2 ? "Fair" : "Poor"}
                      </p>
                    </motion.div>
                  )}

                  {/* Would Recommend */}
                  <div className="space-y-3">
                    <Label className="text-center block">Would you recommend us?</Label>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, would_recommend: true })}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all",
                          formData.would_recommend === true
                            ? "border-verified bg-verified/10 text-verified"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        Yes
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, would_recommend: false })}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all",
                          formData.would_recommend === false
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <ThumbsDown className="w-5 h-5" />
                        No
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={formData.overall_rating === 0}
                    className="w-full rounded-full"
                    size="lg"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle>
                    {isPositiveSentiment ? (
                      <span className="flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        What did you love?
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        How can we improve?
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isPositiveSentiment 
                      ? "Your kind words help other families find us"
                      : "Your feedback helps us serve you better"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Detailed Ratings */}
                  <div className="grid gap-4">
                    {[
                      { key: "communication_rating", label: "Communication" },
                      { key: "professionalism_rating", label: "Professionalism" },
                      { key: "support_rating", label: "Support & Guidance" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFormData({ ...formData, [key]: star })}
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                star <= (formData as any)[key]
                                  ? "text-primary"
                                  : "text-muted-foreground/30 hover:text-muted-foreground"
                              )}
                            >
                              <Star className={cn("w-4 h-4", star <= (formData as any)[key] && "fill-current")} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Positive Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="positive">What went well?</Label>
                    <Textarea
                      id="positive"
                      value={formData.positive_feedback}
                      onChange={(e) => setFormData({ ...formData, positive_feedback: e.target.value })}
                      placeholder="Share what you appreciated about your experience..."
                      rows={3}
                    />
                  </div>

                  {/* Improvement Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="improvement">What could be improved?</Label>
                    <Textarea
                      id="improvement"
                      value={formData.improvement_feedback}
                      onChange={(e) => setFormData({ ...formData, improvement_feedback: e.target.value })}
                      placeholder="Help us understand how we can do better..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="rounded-full">
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1 rounded-full" size="lg">
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Contact & Consent */}
          {step === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle>Almost done!</CardTitle>
                  <CardDescription>
                    Optional: Add your details so we can follow up
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name (optional)</Label>
                      <Input
                        id="name"
                        value={formData.respondent_name}
                        onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.respondent_email}
                        onChange={(e) => setFormData({ ...formData, respondent_email: e.target.value })}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Consent for Public Display */}
                  {isPositiveSentiment && (
                    <div className="p-4 bg-verified/5 rounded-2xl border border-verified/20">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={formData.consent_public}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, consent_public: checked as boolean })
                          }
                        />
                        <div className="space-y-1">
                          <Label htmlFor="consent" className="cursor-pointer font-medium">
                            Share as a public testimonial
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Your positive feedback may be displayed on our profile to help other families. 
                            Your email will never be shared publicly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isPositiveSentiment && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Your feedback is private</p>
                          <p className="text-xs text-muted-foreground">
                            We'll review your feedback internally and may reach out to address your concerns directly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleBack} className="rounded-full">
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={submitFeedbackMutation.isPending}
                      className="flex-1 rounded-full" 
                      size="lg"
                    >
                      {submitFeedbackMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Feedback"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === "submitted" && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-0 shadow-xl text-center">
                <CardContent className="py-12">
                  <div className="w-16 h-16 rounded-full bg-verified/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-verified" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    {isPositiveSentiment && formData.consent_public
                      ? "Your testimonial helps other families find great care."
                      : "Your feedback has been received and will be reviewed by our team."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button asChild className="rounded-full">
                      <Link to={`/agencies/${slug}`}>View Agency Profile</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/">Return Home</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Powered by Foster Care UK</p>
        </div>
      </div>
    </div>
  );
}