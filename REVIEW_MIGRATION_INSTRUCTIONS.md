# Review Migration Instructions

## Database Migration Required

To ensure proper synchronization between the `reviews` table and the `agencies` table, you need to run the following database migration:

### Prerequisites
- Docker Desktop must be running
- Supabase CLI must be installed

### Steps to Apply Migration

1. Start Docker Desktop
2. Run the following command from the project root:
```bash
npx supabase db reset
```

This will apply the migration `20251226200000_add_reviews_triggers.sql` which creates:
- A function `update_agency_review_stats()` that calculates review count and average rating
- Triggers on the `reviews` table that automatically update agency stats when reviews are added, updated, or deleted
- An update to existing agencies to calculate their current review stats

### Why This is Important

The migration ensures that:
- The `review_count` field in the `agencies` table is automatically updated when reviews are added/removed
- The `rating` field in the `agencies` table is automatically updated with the average rating of approved reviews
- Both agency dashboard and agency profile pages show consistent and accurate review information
- Agency owners see the correct number of reviews in their dashboard
- Visitors see accurate review counts and ratings on agency profile pages

### Alternative (If Docker is not available)

If Docker is not available, the current implementation will still work but relies on the frontend calling the `updateAgencyReviewStats` function to keep the counts synchronized. The database triggers provide a more robust solution that ensures data consistency at the database level.