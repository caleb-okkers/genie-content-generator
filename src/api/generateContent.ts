// src/api/generateContent.ts

export type ContentType = 
  | "slogan"
  | "social"
  | "hashtags"
  | "product"
  | "email";

export interface GenerateContentPayload {
  contentType: ContentType;
  businessName: string;
  productInfo?: string;
  targetAudience?: string;
  tone?: string;
  platform?: string;
  variations: number;
  customPrompt?: string;
}

export interface GenerateContentResponse {
  content: string;
  prompt: string;
}

export async function generateContent(payload: GenerateContentPayload): Promise<GenerateContentResponse> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to generate content: ${errorText}`);
    }

    const data = await res.json();
    return data as GenerateContentResponse;
  } catch (err) {
    console.error("Error calling generateContent:", err);
    throw err;
  }
}
