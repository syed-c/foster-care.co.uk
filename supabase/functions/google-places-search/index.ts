import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, location } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "query is required" }),
        { 
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400 
        }
      );
    }

    const googleApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!googleApiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not set");
    }

    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleApiKey}`;
    
    if (location) {
      searchUrl += `&location=${location.lat},${location.lng}&radius=50000`;
    }

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: data.results || [],
        status: data.status
      }),
      { 
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200 
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Google Places search error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to search places" 
      }),
      { 
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500 
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/google-places-search' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
