// supabase/functions/create-paypal-subscription/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate the user. A user must be logged in to create a subscription.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Authentication required to create a subscription.')
    }

    // 2. Get the webhook URL from secure environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_CREATE_PAYPAL_SUB_WEBHOOK_URL')
    if (!n8nWebhookUrl) {
      throw new Error('Server configuration error: PayPal webhook URL not set.')
    }

    const requestBody = await req.json()

    // 3. Forward the request to the n8n webhook, adding the authenticated user's ID
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestBody,
        user_id: user.id // Add user ID for logging/verification in n8n
      }),
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n error: ${await n8nResponse.text()}`)
    }
    
    // 4. Return the JSON response from n8n to the client
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