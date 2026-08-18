import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Instrucción fija — el admin nunca la ve ni la edita
const PROMPT_FIJO = `Elimina el fondo actual de esta foto de producto floral y reemplázalo por un fondo de estudio fotográfico elegante: pared en tono rosa pastel suave con un pedestal/base circular blanco donde se apoya el arreglo, iluminación cálida y profesional tipo softbox, sombra suave y natural debajo del producto. Mantén el producto (flores/arreglo) exactamente igual, sin alterar su forma, color ni detalles. El resultado debe verse como una foto de catálogo de florería premium, alta calidad, enfocado y limpio.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. Verificar que quien llama es admin
    const authHeader = req.headers.get('Authorization')!
    const supabaseCaller = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user: caller } } = await supabaseCaller.auth.getUser()
    if (!caller) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const { data: esAdmin } = await supabaseCaller.from('admins').select('user_id').eq('user_id', caller.id).maybeSingle()
    if (!esAdmin) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 2. Recibir la imagen que mandó el admin
    const formData = await req.formData()
    const imageFile = formData.get('image_file') as File | null
    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'Falta la imagen' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const mimeType = imageFile.type || 'image/jpeg'

    // 3. Llamar a Gemini con la instrucción fija + la imagen
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: PROMPT_FIJO },
              { inline_data: { mime_type: mimeType, data: base64Image } },
            ],
          }],
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      return new Response(JSON.stringify({ error: `Error de Gemini: ${errText}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const geminiData = await geminiRes.json()
    const parts = geminiData?.candidates?.[0]?.content?.parts || []
    const imagenParte = parts.find((p: any) => p.inlineData || p.inline_data)
    const inlineData = imagenParte?.inlineData || imagenParte?.inline_data

    if (!inlineData?.data) {
      return new Response(JSON.stringify({ error: 'Gemini no devolvió una imagen. Intenta de nuevo.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Devolver la imagen ya editada como bytes
    const bytes = Uint8Array.from(atob(inlineData.data), c => c.charCodeAt(0))
    return new Response(bytes, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': inlineData.mimeType || inlineData.mime_type || 'image/png' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})