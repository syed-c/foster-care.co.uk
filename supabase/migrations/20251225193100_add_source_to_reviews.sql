-- Add source column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'user';

-- Add comment to document the purpose of the column
COMMENT ON COLUMN reviews.source IS 'Source of the review: user, google_places, etc.';