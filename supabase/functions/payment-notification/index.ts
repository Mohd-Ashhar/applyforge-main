// supabase/functions/payment-notification/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate the user to ensure notifications are sent by legitimate users
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Authentication required.')

    // Get the webhook URL from secure environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_PAYMENT_NOTIFICATION_WEBHOOK_URL')
    if (!n8nWebhookUrl) throw new Error('Server configuration error: Webhook URL not set.')

    const requestBody = await req.json()

    // Forward the request to the n8n webhook. It's a "fire and forget" call.
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    // Immediately return a success response to the client
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Even if it fails, we don't want to block the client-side flow. Log the error.
    console.error("Payment notification proxy error:", error.message)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})