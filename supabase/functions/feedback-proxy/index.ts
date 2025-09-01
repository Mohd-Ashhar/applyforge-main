// supabase/functions/feedback-proxy/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Authentication required to submit feedback.')
    }

    // 2. Get the n8n webhook URL from secure environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_FEEDBACK_WEBHOOK_URL')
    if (!n8nWebhookUrl) {
      throw new Error('Server configuration error: Webhook URL not set.')
    }
    
    // 3. Get the request body from the client
    const requestBody = await req.json()

    // 4. Securely forward the request to n8n, overwriting the user_id
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestBody,
        user_id: user.id, // Ensure the user_id is the authenticated one
      }),
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n error: ${await n8nResponse.text()}`)
    }
    
    const responseText = await n8nResponse.text()

    // 5. Return a consistent JSON response to the client
    return new Response(JSON.stringify({ message: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})