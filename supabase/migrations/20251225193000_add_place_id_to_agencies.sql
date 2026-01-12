-- Add place_id column to agencies table
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS place_id TEXT;

-- Add comment to document the purpose of the column
COMMENT ON COLUMN agencies.place_id IS 'Google Places API place_id for fetching detailed reviews';