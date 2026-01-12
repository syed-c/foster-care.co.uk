-- Function to update review count and rating for agencies
CREATE OR REPLACE FUNCTION public.update_agency_review_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    review_count INTEGER;
    avg_rating NUMERIC;
BEGIN
    -- Calculate new review count and average rating for the agency
    SELECT 
        COUNT(*)::INTEGER,
        AVG(rating)::NUMERIC
    INTO review_count, avg_rating
    FROM reviews
    WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id)
      AND is_approved = true; -- Only count approved reviews

    -- Update the agency's review count and rating
    UPDATE agencies
    SET 
        review_count = review_count,
        rating = avg_rating
    WHERE id = COALESCE(NEW.agency_id, OLD.agency_id);

    -- Return appropriate value based on operation
    IF TG_OP = 'INSERT' THEN
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
END;
$$;

-- Create triggers on reviews table to update agency stats
CREATE TRIGGER on_review_insert
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    WHEN (NEW.is_approved = true) -- Only trigger if the review is approved
    EXECUTE FUNCTION public.update_agency_review_stats();

CREATE TRIGGER on_review_update
    AFTER UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_agency_review_stats();

CREATE TRIGGER on_review_delete
    AFTER DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_agency_review_stats();

-- Update existing agencies to calculate their current review stats
UPDATE agencies
SET 
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviews.agency_id = agencies.id 
          AND reviews.is_approved = true
    ),
    rating = (
        SELECT AVG(rating)
        FROM reviews 
        WHERE reviews.agency_id = agencies.id 
          AND reviews.is_approved = true
    );