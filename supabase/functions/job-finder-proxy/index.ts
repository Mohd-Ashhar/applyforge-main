// supabase/functions/job-finder-proxy/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. Authenticate the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError?.message)
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Get the n8n webhook URL from secure environment variables
    const n8nWebhookUrl = Deno.env.get('N8N_JOB_FINDER_WEBHOOK_URL')
    if (!n8nWebhookUrl) {
      console.error('N8N Job Finder webhook URL is not set in environment variables.')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Get the request body from the client
    const requestBody = await req.json()

    // 4. Securely forward the request to n8n from the server
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Construct the body for n8n, overwriting with the authenticated user ID
      body: JSON.stringify({
        ...requestBody,
        user_id: user.id, 
      }),
    })

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        console.error('n8n request failed:', errorText)
        return new Response(JSON.stringify({ error: `n8n error: ${n8nResponse.statusText}` }), {
          status: n8nResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    const responseData = await n8nResponse.json()

    // 5. Return the response from n8n to the client
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})