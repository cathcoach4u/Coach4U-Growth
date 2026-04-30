// AI helpers for the Growth Hub
// Calls a Supabase Edge Function which handles the Anthropic API integration.
// Note: SUPABASE_ANON_KEY is defined in supabase.js

const EDGE_FUNCTION_URL = 'https://uoixetfvboevjxlkfyqy.supabase.co/functions/v1/ai-proxy'

// Demo response (fallback when the Edge Function is unavailable)
function getDemoAIResponse(message, hub, onChunk) {
  const response = `Thanks for sharing that! Here are a few growth-marketing thoughts:

**Key considerations:**
- Anchor every campaign in a measurable company priority
- Build content around the personas you actually want to attract
- Track MQLs, pipeline and revenue attribution — not vanity metrics

**Next steps:**
1. Pick the single quarterly priority that most needs marketing support
2. Pick one channel and one persona to focus the next campaign on
3. Define the success metric before you start spending

This is demo mode — the live AI coach connects via the Supabase Edge Function. The forms in the Growth Hub still capture everything you plan here.`

  if (onChunk) {
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
    }
  }

  return response;
}

/**
 * Ask AI with streaming response
 * @param {string} message - The user's message
 * @param {string} hub - The hub name (kept for Edge Function compatibility; the Growth Hub passes 'growth')
 * @param {string} module - The module name (for context)
 * @param {string} context - Additional context about the user
 * @param {function} onChunk - Callback called with each text chunk as it arrives
 * @returns {Promise<string>} The complete response
 */
window.askAI = async function(message, hub, module, context, onChunk) {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        message: message,
        hub: hub,
        module: module,
        context: context,
        stream: true
      })
    })

    if (!response.ok) {
      if (response.status === 500 || response.status === 404) {
        return getDemoAIResponse(message, hub, onChunk)
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]') {
            continue
          }

          try {
            const json = JSON.parse(data)

            if (json.type === 'content_block_delta' && json.delta.type === 'text_delta') {
              const text = json.delta.text
              fullResponse += text

              if (onChunk) {
                onChunk(text)
              }
            }
          } catch (e) {
            // Parse error on this line, continue
          }
        }
      }
    }

    return fullResponse
  } catch (err) {
    console.error('AI API error:', err)
    throw err
  }
}

/**
 * Ask AI and get full response as string (non-streaming)
 */
window.askAISimple = async function(message, hub, module, context) {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        message: message,
        hub: hub,
        module: module,
        context: context,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()

    if (json.content && json.content.length > 0 && json.content[0].text) {
      return json.content[0].text
    }

    if (json.text) {
      return json.text
    }

    throw new Error('No response text from API')
  } catch (err) {
    console.error('AI API error:', err)
    throw err
  }
}
