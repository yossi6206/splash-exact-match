import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed tables whitelist for security
const ALLOWED_TABLES = ['cars', 'properties', 'laptops', 'businesses', 'freelancers', 'jobs', 'secondhand_items', 'projects'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { table, id } = await req.json()

    // Validate table name against whitelist
    if (!table || !ALLOWED_TABLES.includes(table)) {
      console.error(`Invalid table name attempted: ${table}`)
      return new Response(
        JSON.stringify({ error: 'Invalid table name' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      console.error(`Invalid id format: ${id}`)
      return new Response(
        JSON.stringify({ error: 'Invalid id format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

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
