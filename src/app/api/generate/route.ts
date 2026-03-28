import { NextRequest, NextResponse } from "next/server";

// Replicate API configuration
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || "";

// Style prompts
const STYLE_PROMPTS = {
  anime: "anime portrait, anime art style, studio ghibli inspired, detailed anime illustration, vibrant colors, high quality anime artwork, 2d anime style",
  cyberpunk: "cyberpunk portrait, neon lights, futuristic style, sci-fi aesthetic, glowing effects, cyberpunk 2077 inspired, detailed digital art, dystopian"
};

interface ReplicateResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

async function generateStyle(imageBase64: string, style: "anime" | "cyberpunk"): Promise<string> {
  const prompt = STYLE_PROMPTS[style];
  
  // Using InstantID model for face style transfer
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "03914a0c3326bf44383d0cd84b06822618af879229ce5d1d53bef38d93b68279",
      input: {
        input_image: imageBase64,
        prompt: prompt,
        negative_prompt: "ugly, deformed, noisy, blurry, low contrast, distorted, disfigured",
        num_inference_steps: 30,
        guidance_scale: 5,
        ip_adapter_scale: 0.8,
        controlnet_conditioning_scale: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to start generation");
  }

  const prediction: ReplicateResponse = await response.json();

  // Poll for result
  let result = prediction;
  let attempts = 0;
  const maxAttempts = 60; // 60 * 2s = 120s max wait

  while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const pollResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${result.id}`,
      {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    );

    if (!pollResponse.ok) {
      throw new Error("Failed to check generation status");
    }

    result = await pollResponse.json();
    attempts++;
  }

  if (result.status === "failed") {
    throw new Error(result.error || "Generation failed");
  }

  if (!result.output || result.output.length === 0) {
    throw new Error("No output generated");
  }

  return result.output[0];
}

// Demo mode: Return placeholder images when no API token
function getDemoImage(style: "anime" | "cyberpunk", originalImage: string): string {
  // In demo mode, return the original image
  // In production, this would be replaced with actual AI-generated images
  return originalImage;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check if we have API token
    const isDemoMode = !REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === "";

    let styleA: string;
    let styleB: string;

    // Enable real API when credit is available
    const useRealAPI = true;
    
    if (!useRealAPI || isDemoMode) {
      // Demo mode: Return original image as placeholder
      styleA = getDemoImage("anime", image);
      styleB = getDemoImage("cyberpunk", image);
    } else {
      // Production mode: Call Replicate API
      const [animeResult, cyberpunkResult] = await Promise.all([
        generateStyle(image, "anime"),
        generateStyle(image, "cyberpunk"),
      ]);
      
      styleA = animeResult;
      styleB = cyberpunkResult;
    }

    return NextResponse.json({ styleA, styleB, demo: isDemoMode });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
