// supabase/functions/create-payment-subscription/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate the user. A user must be logged in to create a subscription.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Authentication required to create a subscription.')

    // Get the webhook URL from secure environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_CREATE_NEW_RAZORPAY_SUBSCRIPTION_WEBHOOK_URL')
    if (!n8nWebhookUrl) throw new Error('Server configuration error: Webhook URL not set.')

    const requestBody = await req.json()

    // Forward the request to the n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    if (!n8nResponse.ok) throw new Error(`n8n error: ${await n8nResponse.text()}`)
    
    const responseData = await n8nResponse.json()

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})