import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || "";

const STYLE_PROMPTS = {
  female: {
    anime: "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), japanese anime style, manga art, anime face, big expressive eyes, (flawless skin:1.6), (smooth skin:1.6), (beautiful face:1.6), (perfect skin:1.5), (porcelain skin:1.4), beautiful anime character, cel shading, vibrant colors, kawaii, anime illustration, detailed anime portrait, same person, same face, soft lighting, perfect lighting",
    "q-anime": "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), chibi style, super cute, kawaii, big head, adorable, chibi character, cute anime style, pastel colors, soft shading, (flawless skin:1.6), (smooth skin:1.6), (beautiful face:1.6), (perfect skin:1.5), (porcelain skin:1.4), same person, same face, big sparkly eyes, blush, soft lighting",
    cyberpunk: "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), cyberpunk portrait, neon lights, futuristic style, sci-fi aesthetic, glowing effects, cyberpunk 2077 inspired, detailed digital art, (flawless skin:1.6), (smooth skin:1.6), (beautiful face:1.6), (perfect skin:1.5), dystopian, same person, same face, perfect lighting, cinematic lighting",
    "3d": "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), 3D render, octane render, unreal engine 5, disney pixar style, CGI, detailed 3D portrait, (flawless skin:1.6), (smooth skin:1.6), (beautiful face:1.6), (perfect skin:1.5), (porcelain skin:1.4), volumetric lighting, ambient occlusion, same person, same face, professional 3D art"
  },
  male: {
    anime: "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), shonen anime male character, sharp jawline, intense eyes, strong masculine features, (clear skin:1.3), (handsome:1.5), dark cool anime style, cel shading, dark background, cool tones, dramatic shadows, same person, same face, dramatic lighting",
    "q-anime": "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), oil painting portrait, classic art style, rich warm colors, textured brushstrokes, detailed portrait painting, (clear skin:1.3), (handsome:1.4), (defined jawline:1.3), same person, same face, artistic oil painting, museum quality, warm tones, dramatic lighting",
    cyberpunk: "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), cyberpunk male portrait, dark neon lights, futuristic style, sci-fi aesthetic, glowing blue and red effects, cyberpunk 2077 inspired male character, detailed digital art, (clear skin:1.4), (handsome face:1.5), (defined jawline:1.3), dark dystopian background, same person, same face, cinematic lighting, masculine, dark atmosphere",
    "3d": "(masterpiece:1.4), (best quality:1.4), (ultra detailed:1.5), 3D render, octane render, unreal engine 5, realistic 3D male portrait, CGI, detailed 3D portrait, (clear skin:1.4), (handsome face:1.5), (defined jawline:1.3), volumetric lighting, ambient occlusion, same person, same face, professional 3D art, dark background, masculine features, studio lighting"
  }
};

type StyleType = keyof typeof STYLE_PROMPTS;

// 后处理：美化图片 + 加水印
async function enhanceImage(imageUrl: string, addWatermark: boolean = true): Promise<string> {
  try {
    console.log("Enhancing image from:", imageUrl);
    
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.log("Fetch failed, returning original URL");
      return imageUrl;
    }
    
    const buffer = await response.arrayBuffer();
    console.log("Downloaded buffer size:", buffer.byteLength);
    
    if (buffer.byteLength < 1000) {
      console.log("Buffer too small, returning original URL");
      return imageUrl;
    }
    
    // 用 Sharp 处理 - 轻度处理保持真实感
    let pipeline = sharp(Buffer.from(buffer))
      .modulate({
        brightness: 0.98,
        saturation: 1.05,
        hue: 0,
      })
      .sharpen({
        sigma: 0.5,
        flat: 1,
        jagged: 0.3,
      });
    
    // 加水印
    if (addWatermark) {
      const meta = await sharp(Buffer.from(buffer)).metadata();
      const imgWidth = meta.width || 512;
      const fontSize = Math.max(16, Math.floor(imgWidth / 25));
      
      // 创建水印 SVG
      const watermarkText = "Absolute Two Face";
      const svgWatermark = `
        <svg width="${imgWidth}" height="${fontSize + 20}">
          <style>
            .watermark { 
              fill: rgba(255,255,255,0.4); 
              font-size: ${fontSize}px; 
              font-family: Arial, sans-serif;
              font-weight: bold;
            }
          </style>
          <text x="${imgWidth - fontSize * watermarkText.length * 0.5 - 10}" y="${fontSize}" class="watermark">${watermarkText}</text>
        </svg>`;
      
      const watermarkBuffer = Buffer.from(svgWatermark);
      pipeline = pipeline.composite([{
        input: watermarkBuffer,
        gravity: 'southeast',
      }]);
    }
    
    const enhanced = await pipeline.toBuffer();
    
    // 转成 base64
    const base64 = `data:image/png;base64,${enhanced.toString('base64')}`;
    console.log("Enhancement successful, base64 length:", base64.length);
    return base64;
  } catch (error) {
    console.error("Enhance failed:", error);
    // 如果失败，返回原图 URL
    return imageUrl;
  }
}

async function generateStyle(imageBase64: string, style: StyleType, gender: "male" | "female", addWatermark: boolean = true): Promise<string> {
  const prompt = STYLE_PROMPTS[gender][style];
  
  const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
      input: {
        image: imageBase64,
        prompt: prompt,
        negative_prompt: "(ugly:1.5), (deformed:1.4), (blurry:1.4), (low quality:1.5), (bad anatomy:1.4), (bad proportions:1.4), (distorted face:1.5), (bad face:1.5), (extra limbs:1.4), (cloned face:1.5), (disfigured:1.4), (gross:1.4), (acne:1.5), (blemishes:1.5), (spots:1.5), (wrinkles:1.3), (dark circles:1.4), (bad skin:1.5), (rough skin:1.5)",
        num_inference_steps: 40,
        guidance_scale: 7,
        ip_adapter_scale: 0.95,
        controlnet_conditioning_scale: 0.95,
        num_outputs: 1,
      },
    }),
  });

  if (!startResponse.ok) {
    const error = await startResponse.json();
    throw new Error(error.detail || "Failed to start generation");
  }

  const prediction = await startResponse.json();
  console.log(`[${style}] Started prediction:`, prediction.id);

  let result = prediction;
  let attempts = 0;
  const maxAttempts = 90;  // 延长到 3 分钟

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
    console.log(`[${style}] Status: ${result.status}, attempt ${attempts + 1}`);
    attempts++;
  }

  if (result.status === "failed") {
    throw new Error(result.error || "Generation failed");
  }

  if (!result.output || result.output.length === 0) {
    console.log(`[${style}] No output. Full result:`, JSON.stringify(result));
    throw new Error("No output generated");
  }

  console.log(`[${style}] Success! Enhancing image...`);
  
  // 后处理美化 + 水印
  const enhanced = await enhanceImage(result.output[0], addWatermark);
  return enhanced;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, gender } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ 
        error: "Replicate API token not configured",
        demo: true 
      }, { status: 500 });
    }

    const userGender: "male" | "female" = gender === "male" ? "male" : "female";
    const addWatermark: boolean = body.addWatermark !== false; // 默认加水印
    console.log(`Starting style generation for ${userGender}, watermark: ${addWatermark}...`);

    // Generate all 4 styles sequentially
    const styleA = await generateStyle(image, "anime", userGender, addWatermark);
    const styleB = await generateStyle(image, "q-anime", userGender, addWatermark);
    const styleC = await generateStyle(image, "cyberpunk", userGender, addWatermark);
    const styleD = await generateStyle(image, "3d", userGender, addWatermark);

    console.log("All 4 styles generated and enhanced!");
    return NextResponse.json({ 
      styleA, 
      styleB, 
      styleC, 
      styleD, 
      demo: false 
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
