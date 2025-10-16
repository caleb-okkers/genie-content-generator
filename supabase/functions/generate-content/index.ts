import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, businessName, productInfo, targetAudience, tone, platform, variations, customPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (customPrompt) {
      systemPrompt = "You are a creative AI content generator.";
      userPrompt = customPrompt;
    } else {
      switch (contentType) {
        case "slogan":
          systemPrompt = "You are a creative copywriter specializing in memorable slogans and taglines.";
          userPrompt = `Generate ${variations} catchy slogan${variations > 1 ? 's' : ''} for ${businessName}. Product/Service: ${productInfo}. Make them memorable, concise, and impactful. Return each slogan on a new line, numbered.`;
          break;
        case "social":
          systemPrompt = "You are a social media marketing expert who creates engaging content.";
          userPrompt = `Generate ${variations} engaging social media caption${variations > 1 ? 's' : ''} for ${businessName}. Product/Service: ${productInfo}. Platform: ${platform}. Target Audience: ${targetAudience}. Tone: ${tone}. Make them compelling and platform-appropriate. Return each caption on a new line, numbered.`;
          break;
        case "hashtags":
          systemPrompt = "You are a social media strategist who creates trending hashtags.";
          userPrompt = `Generate ${variations} set${variations > 1 ? 's' : ''} of relevant hashtags for ${businessName}. Product/Service: ${productInfo}. Platform: ${platform}. Include a mix of popular and niche hashtags (5-10 per set). Return each set on a new line, numbered.`;
          break;
        case "product":
          systemPrompt = "You are an e-commerce copywriter who writes compelling product descriptions.";
          userPrompt = `Generate ${variations} compelling product description${variations > 1 ? 's' : ''} for ${businessName}. Product/Service: ${productInfo}. Target Audience: ${targetAudience}. Tone: ${tone}. Make them persuasive and highlight key benefits. Return each description on a new line, numbered.`;
          break;
        case "email":
          systemPrompt = "You are an email marketing specialist who creates high-converting email copy.";
          userPrompt = `Generate ${variations} email marketing cop${variations > 1 ? 'ies' : 'y'} for ${businessName}. Product/Service: ${productInfo}. Target Audience: ${targetAudience}. Tone: ${tone}. Include subject line and body. Make them engaging and action-oriented. Return each email on a new line, numbered, with 'Subject:' and 'Body:' labels.`;
          break;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ content: generatedText, prompt: userPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-content function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
