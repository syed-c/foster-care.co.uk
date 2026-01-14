import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface PlaceDetailsResponse {
  result: {
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number; // Unix timestamp
      profile_photo_url?: string;
    }>;
    review_summary?: string;
    rating: number;
    user_ratings_total: number;
  };
  status: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { place_id } = await req.json();

  if (!place_id) {
    return new Response(
      JSON.stringify({ error: "place_id is required" }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 400 
      }
    );
  }

  try {
    const googleApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!googleApiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not set");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews,review_summary,rating,user_ratings_total&key=${googleApiKey}`
    );

    const data: PlaceDetailsResponse = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reviews: data.result.reviews || [],
        rating: data.result.rating,
        user_ratings_total: data.result.user_ratings_total,
        review_summary: data.result.review_summary
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 200 
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Fetch place reviews error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to fetch place reviews" 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 500 
      }
    );
  }
});