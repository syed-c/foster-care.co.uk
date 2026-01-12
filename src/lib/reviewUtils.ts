import { supabase } from "@/integrations/supabase/client";

export const updateAgencyReviewStats = async (agencyId: string) => {
  try {
    // Get all reviews for the agency
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating, is_approved")
      .eq("agency_id", agencyId);

    if (reviewsError) throw reviewsError;

    // Calculate stats for approved reviews only
    const approvedReviews = reviews.filter(review => review.is_approved);
    const reviewCount = approvedReviews.length;
    
    let avgRating = 0;
    if (approvedReviews.length > 0) {
      const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / approvedReviews.length;
    }

    // Update the agency with the new stats
    const { error: updateError } = await supabase
      .from("agencies")
      .update({
        review_count: reviewCount,
        rating: avgRating || null
      })
      .eq("id", agencyId);

    if (updateError) throw updateError;

    return { reviewCount, avgRating };
  } catch (error) {
    console.error("Error updating agency review stats:", error);
    throw error;
  }
};