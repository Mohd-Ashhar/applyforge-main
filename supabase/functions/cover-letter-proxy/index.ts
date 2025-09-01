// supabase/functions/cover-letter-proxy/index.ts

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
    const n8nWebhookUrl = Deno.env.get('N8N_COVER_LETTER_WEBHOOK_URL')
    if (!n8nWebhookUrl) {
      console.error('N8N Cover Letter webhook URL is not set in environment variables.')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Parse the incoming multipart/form-data from the client
    const formData = await req.formData()
    
    // 4. Securely set the user_id and forward the form data to the n8n webhook
    formData.set('user_id', user.id)

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n request failed:', errorText)
      return new Response(errorText, {
        status: n8nResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      })
    }

    const responseData = await n8nResponse.text()

    // 5. Return the response from n8n (the generated cover letter URL) to the client
    return new Response(responseData, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
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