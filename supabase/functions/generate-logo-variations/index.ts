import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { variation } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Define prompts for each variation
    const prompts: Record<string, string> = {
      'all-white': 'Generate a professional logo with "TD" icon and "The Trading Diary" text, all in pure white color on transparent background. Modern, clean design, high resolution 2048x512px, ultra sharp, vector-style quality',
      'all-black': 'Generate a professional logo with "TD" icon and "The Trading Diary" text, all in pure black color on transparent background. Modern, clean design, high resolution 2048x512px, ultra sharp, vector-style quality',
      'blue-white': 'Generate a professional logo with "TD" icon in vibrant blue (#3B82F6) and "The Trading Diary" text in white on transparent background. Modern, clean design, high resolution 2048x512px, ultra sharp, vector-style quality',
      'blue-black': 'Generate a professional logo with "TD" icon in vibrant blue (#3B82F6) and "The Trading Diary" text in black on transparent background. Modern, clean design, high resolution 2048x512px, ultra sharp, vector-style quality',
      'blue-gray': 'Generate a professional logo with "TD" icon in vibrant blue (#3B82F6) and "The Trading Diary" text in dark gray (#374151) on transparent background. Modern, clean design, high resolution 2048x512px, ultra sharp, vector-style quality',
      'vietnam': 'Generate a creative professional logo with "TD" icon and "The Trading Diary" text using Vietnam flag colors (vibrant red and golden yellow). The icon could have red background with yellow star elements, text in golden yellow. Modern, patriotic, high resolution 2048x512px, transparent background, ultra sharp',
      'usa': 'Generate a creative professional logo with "TD" icon and "The Trading Diary" text using American flag colors (red #B22234, white #FFFFFF, blue #3C3B6E). Bold patriotic design with stars and stripes inspiration. Modern, premium, high resolution 2048x512px, transparent background, ultra sharp',
      'uae': 'Generate a creative professional logo with "TD" icon and "The Trading Diary" text using UAE flag colors (red, green, white, black). Elegant Arabic-inspired design. Modern, luxurious, high resolution 2048x512px, transparent background, ultra sharp',
      'brazil': 'Generate a creative professional logo with "TD" icon and "The Trading Diary" text using Brazilian flag colors (vibrant green, golden yellow, deep blue, white). Dynamic tropical design. Modern, energetic, high resolution 2048x512px, transparent background, ultra sharp'
    };

    const prompt = prompts[variation];
    if (!prompt) {
      throw new Error('Invalid variation specified');
    }

    console.log(`Generating logo variation: ${variation}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated in response');
    }

    console.log(`Successfully generated ${variation} logo`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        variation 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating logo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
