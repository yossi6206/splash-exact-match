import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    console.log('Fetching geo analytics for user:', user.id)

    // Use service role to fetch user's item IDs from all tables
    const serviceSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Collect all item IDs for this user
    const itemIds: string[] = []
    const tables = ['cars', 'properties', 'laptops', 'jobs', 'secondhand_items', 'businesses', 'freelancers']

    for (const table of tables) {
      const { data } = await serviceSupabase
        .from(table)
        .select('id')
        .eq('user_id', user.id)

      if (data) {
        itemIds.push(...data.map((item: any) => item.id))
      }
    }

    console.log('Found item IDs:', itemIds.length)

    if (itemIds.length === 0) {
      return new Response(
        JSON.stringify({ locationData: [], conversionData: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch geo data for these items
    const { data: geoData, error: geoError } = await serviceSupabase
      .from('promotion_impressions_log')
      .select('city, country, item_type, item_id')
      .in('item_id', itemIds)

    if (geoError) {
      console.error('Error fetching geo data:', geoError)
      throw geoError
    }

    console.log('Fetched geo records:', geoData?.length || 0)

    // Process location data
    const locationCounts: { [key: string]: number } = {}
    if (geoData) {
      geoData.forEach((item: any) => {
        const location = item.city || item.country || 'לא ידוע'
        locationCounts[location] = (locationCounts[location] || 0) + 1
      })
    }

    const locationData = Object.entries(locationCounts)
      .map(([location, impressions]) => ({ location, impressions }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10)

    return new Response(
      JSON.stringify({ locationData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-geo-analytics:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
