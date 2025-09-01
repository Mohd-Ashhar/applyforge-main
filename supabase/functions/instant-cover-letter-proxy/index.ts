// supabase/functions/instant-cover-letter-proxy/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Authentication failed')

    // Get webhook URL from secrets
    const n8nWebhookUrl = Deno.env.get('N8N_INSTANT_COVER_LETTER_WEBHOOK_URL')
    if (!n8nWebhookUrl) throw new Error('Server configuration error: Webhook URL not set')

    // Parse and forward FormData
    const formData = await req.formData()
    formData.set('user_id', user.id)

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!n8nResponse.ok) throw new Error(`n8n error: ${await n8nResponse.text()}`)
    
    const responseData = await n8nResponse.text()

    // Return response to client
    return new Response(responseData, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})