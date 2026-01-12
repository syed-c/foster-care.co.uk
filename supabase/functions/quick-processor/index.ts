import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  place_id?: string; // Add place_id for detailed review fetching
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const { query, location, radius = 50000 } = await req.json();

    if (!query && !location) {
      throw new Error('Please provide a search query or location');
    }

    // Build search query
    const searchQuery = query 
      ? `${query} ${location || ''}`.trim()
      : `fostering agency ${location}`;

    console.log('Searching Google Places for:', searchQuery);

    // Use Text Search API (New) for better results
    const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
    
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        languageCode: 'en',
        regionCode: 'GB',
        maxResultCount: 50,
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Google Places API error:', errorText);
      throw new Error(`Google Places API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Found places:', searchData.places?.length || 0);

    // Transform results
    const results: PlaceResult[] = (searchData.places || []).map((place: any) => ({
      id: place.id,
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || '',
      phone: place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      rating: place.rating || null,
      reviewCount: place.userRatingCount || 0,
      place_id: place.placeId || place.id, // Use the proper place ID for fetching detailed reviews
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      count: results.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in google-places-search:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      results: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
