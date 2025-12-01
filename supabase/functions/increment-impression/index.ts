import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to get geolocation from IP
async function getGeolocation(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    if (response.ok) {
      const data = await response.json()
      return {
        country: data.country_name || null,
        city: data.city || null,
        region: data.region || null,
      }
    }
  } catch (error) {
    console.log('Geolocation fetch error:', error)
  }
  return { country: null, city: null, region: null }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { table, id } = await req.json()
    
    // Extract IP and User-Agent from request
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('cf-connecting-ip') || 
               'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Get geolocation data
    const geo = await getGeolocation(ip)

    console.log(`Incrementing impression for ${table} with id ${id}`)
    
    // Use service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, get current promotion_impressions value
    const { data: current, error: fetchError } = await supabase
      .from(table)
      .select('promotion_impressions')
      .eq('id', id)
      .eq('is_promoted', true)
      .single()

    if (fetchError) {
      console.error('Error fetching current data:', fetchError)
      throw fetchError
    }

    if (!current) {
      console.log('Item not found or not promoted')
      return new Response(
        JSON.stringify({ success: true, message: 'Item not found or not promoted' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update with incremented value
    const newImpressions = (current.promotion_impressions || 0) + 1
    console.log(`Updating impression count from ${current.promotion_impressions} to ${newImpressions}`)

    const { error: updateError } = await supabase
      .from(table)
      .update({
        promotion_impressions: newImpressions,
        last_top_position_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('is_promoted', true)

    if (updateError) {
      console.error('Error updating impression:', updateError)
      throw updateError
    }

    // Log detailed impression data
    const { error: logError } = await supabase
      .from('promotion_impressions_log')
      .insert({
        item_type: table,
        item_id: id,
        country: geo.country,
        city: geo.city,
        region: geo.region,
        ip_address: ip,
        user_agent: userAgent
      })

    if (logError) {
      console.error('Error logging impression details:', logError)
      // Don't fail the request if logging fails
    }

    console.log('Successfully incremented impression')

    return new Response(
      JSON.stringify({ success: true, impressions: newImpressions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in increment-impression function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
