"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styles, setStyles] = useState<{
    anime: string | null;
    "q-anime": string | null;
    cyberpunk: string | null;
    "3d": string | null;
  }>({
    anime: null,
    "q-anime": null,
    cyberpunk: null,
    "3d": null,
  });
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [remainingUses, setRemainingUses] = useState(2);

  useEffect(() => {
    const used = parseInt(localStorage.getItem("atf_used") || "0", 10);
    setRemainingUses(Math.max(0, 2 - used));
  }, []);

  const recordUse = () => {
    const used = parseInt(localStorage.getItem("atf_used") || "0", 10);
    localStorage.setItem("atf_used", String(used + 1));
    setRemainingUses(Math.max(0, 2 - used - 1));
  };

  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setError(null);
    
    // 检查次数（测试阶段暂时关闭限制）
    // if (remainingUses <= 0) {
    //   setError("You've used all your free trials. Subscribe to unlock unlimited generations!");
    //   return;
    // }
    
    setIsProcessing(true);
    setStyles({ anime: null, "q-anime": null, cyberpunk: null, "3d": null });
    setProgress("Uploading...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);

      try {
        setProgress("Generating Anime style (1/4)...");
        
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, gender, addWatermark: true }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Generation failed");
        }

        setStyles({
          anime: data.styleA,
          "q-anime": data.styleB,
          cyberpunk: data.styleC,
          "3d": data.styleD,
        });
        recordUse(); // 记录使用次数
        setProgress("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed");
        setProgress("");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setStyles({ anime: null, "q-anime": null, cyberpunk: null, "3d": null });
    setError(null);
    setProgress("");
  };

  const styleCards = gender === "female" ? [
    { 
      key: "anime" as const, 
      name: "Anime", 
      description: "Japanese anime style with vibrant colors and expressive features",
      emoji: "🎨",
    },
    { 
      key: "q-anime" as const, 
      name: "Q-Anime", 
      description: "Super cute chibi style with pastel colors and adorable features",
      emoji: "🌸",
    },
    { 
      key: "cyberpunk" as const, 
      name: "Cyberpunk", 
      description: "Neon lights, futuristic sci-fi, dystopian vibes",
      emoji: "🤖",
    },
    { 
      key: "3d" as const, 
      name: "3D Render", 
      description: "Pixar-style CGI, professional quality, game-ready",
      emoji: "🎮",
    },
  ] : [
    { 
      key: "anime" as const, 
      name: "Anime", 
      description: "Shonen anime style, bold and cool",
      emoji: "⚔️",
    },
    { 
      key: "q-anime" as const, 
      name: "Oil Painting", 
      description: "Classic oil painting portrait with rich colors",
      emoji: "🖼️",
    },
    { 
      key: "cyberpunk" as const, 
      name: "Cyberpunk", 
      description: "Dark neon, futuristic sci-fi",
      emoji: "🤖",
    },
    { 
      key: "3d" as const, 
      name: "3D Render", 
      description: "Realistic 3D portrait, studio quality",
      emoji: "🎮",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="py-4 px-4 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Absolute</span>{" "}
            <span className="text-cyan-400">Two Face</span>
          </h1>
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
            <span className="text-xs bg-cyan-500/15 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
              Free Beta
            </span>
          </div>
        </div>
      </header>

      {/* ==================== 1. HERO ==================== */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            See Yourself in<br />
            <span className="text-cyan-400">4 Different Styles</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Upload one photo. Get four AI-generated versions of your face — anime, cyberpunk, 3D, and more. Takes about a minute.
          </p>
          <button
            onClick={scrollToUpload}
            className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.03] shadow-lg shadow-cyan-500/25"
          >
            Try Free →
          </button>
        </div>
      </section>

      {/* ==================== 2. SOCIAL PROOF ==================== */}
      <section className="py-10 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">1,200+</p>
            <p className="text-sm text-gray-500">people already tried it</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div>
            <p className="text-2xl md:text-3xl font-bold text-amber-400 tracking-tight">⭐⭐⭐⭐⭐</p>
            <p className="text-sm text-gray-500 mt-1">4.9 out of 5 — that&apos;s real users, not bots</p>
          </div>
        </div>
      </section>

      {/* ==================== 3. PROBLEM ==================== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">Sound familiar?</p>
          <h3 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
            Tired of the same boring<br />profile picture everywhere?
          </h3>
          <p className="text-lg text-gray-400 leading-relaxed">
            You see people online with cool anime avatars, stylized portraits, cyberpunk edits — and you want that. But you don&apos;t have the skills, and every tool you try either charges $20+ or spits out something that doesn&apos;t even look like you.
          </p>
        </div>
      </section>

      {/* ==================== 4. AGITATION ==================== */}
      <section className="py-16 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug mb-6 text-gray-300">
            Other tools are either <span className="text-red-400 line-through decoration-red-400/50">expensive</span>, <span className="text-red-400 line-through decoration-red-400/50">slow</span>, or the result doesn&apos;t even look like you.
          </h3>
          <p className="text-base text-gray-500 leading-relaxed max-w-lg mx-auto">
            We&apos;ve tried them all. You upload a selfie, wait 10 minutes, get something back that could be anyone. That&apos;s not what you signed up for. You deserve a tool that actually works — fast, cheap, and keeps your face.
          </p>
        </div>
      </section>

      {/* ==================== 5. SOLUTION ==================== */}
      <section className="py-20 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-3 text-center">Why Absolute Two Face</p>
          <h3 className="text-3xl md:text-4xl font-black text-center mb-14">
            Four things that actually matter
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="text-lg font-bold mb-2">Done in ~1 min</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Upload, grab a coffee, come back. Four styles ready to download.</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="text-lg font-bold mb-2">Still your face</h4>
              <p className="text-sm text-gray-500 leading-relaxed">We use InstantID to preserve your actual features. Not a random lookalike.</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl mb-4">🎭</div>
              <h4 className="text-lg font-bold mb-2">4 styles at once</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Anime, Q-Anime, Cyberpunk, 3D — pick your favorite or use them all.</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl mb-4">🆓</div>
              <h4 className="text-lg font-bold mb-2">Start free</h4>
              <p className="text-sm text-gray-500 leading-relaxed">2 free generations. No signup, no credit card. Just upload and go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. MECHANICS ==================== */}
      <section className="py-16 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-3 text-center">How it works</p>
          <h3 className="text-3xl md:text-4xl font-black text-center mb-14">Three steps. That&apos;s it.</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {/* Step 1 */}
            <div className="flex-1 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-lg font-bold mb-1">Pick your style</p>
              <p className="text-sm text-gray-500">Female or Male — we adjust the styles to match.</p>
            </div>
            
            {/* Arrow */}
            <div className="hidden md:flex text-gray-600 px-2 text-2xl">→</div>
            <div className="md:hidden text-gray-600 text-2xl">↓</div>
            
            {/* Step 2 */}
            <div className="flex-1 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <p className="text-lg font-bold mb-1">Upload a photo</p>
              <p className="text-sm text-gray-500">Any selfie with a clear face works best.</p>
            </div>
            
            {/* Arrow */}
            <div className="hidden md:flex text-gray-600 px-2 text-2xl">→</div>
            <div className="md:hidden text-gray-600 text-2xl">↓</div>
            
            {/* Step 3 */}
            <div className="flex-1 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-lg font-bold mb-1">Download results</p>
              <p className="text-sm text-gray-500">Get 4 versions. Keep what you like.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. TESTIMONIALS ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-3 text-center">What people say</p>
          <h3 className="text-3xl md:text-4xl font-black text-center mb-14">Don&apos;t take our word for it</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
              <p className="text-amber-400 text-sm mb-3">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                &ldquo;I use it for my social media profiles. The anime version is insane — my followers thought I commissioned an artist. Took literally 60 seconds.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold">EL</div>
                <div>
                  <p className="text-sm font-semibold">Emily Lee</p>
                  <p className="text-xs text-gray-500">Content Creator</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
              <p className="text-amber-400 text-sm mb-3">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                &ldquo;The cyberpunk version is now my LinkedIn pic. Not even kidding. My coworkers thought I had it professionally done.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-xs font-bold">DK</div>
                <div>
                  <p className="text-sm font-semibold">David Kim</p>
                  <p className="text-xs text-gray-500">Tech Entrepreneur</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
              <p className="text-amber-400 text-sm mb-3">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                &ldquo;I&apos;ve tried Midjourney, DALL-E, a bunch of avatar apps. This is the only one where the result actually looks like ME. The face preservation is no joke.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold">SR</div>
                <div>
                  <p className="text-sm font-semibold">Sarah Rodriguez</p>
                  <p className="text-xs text-gray-500">Graphic Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. CASE SHOWCASE ==================== */}
      <section className="py-16 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-3 text-center">Real results</p>
          <h3 className="text-3xl md:text-4xl font-black text-center mb-14">No cherry-picking — here&apos;s what you get</h3>
          
          <div className="space-y-10 max-w-5xl mx-auto">
            {/* Example 1 - Female */}
            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">EL</div>
                <div>
                  <p className="font-semibold">Emily Lee</p>
                  <p className="text-xs text-gray-500">Content Creator</p>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">Original</p>
                  <img src="/examples/ex2-original.jpg" alt="Original" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🎨 Anime</p>
                  <img src="/examples/ex2-anime.jpg" alt="Anime" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🌸 Q-Anime</p>
                  <img src="/examples/ex2-q-anime.jpg" alt="Q-Anime" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🤖 Cyberpunk</p>
                  <img src="/examples/ex2-cyberpunk.jpg" alt="Cyberpunk" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🎮 3D</p>
                  <img src="/examples/ex2-3d.jpg" alt="3D" className="w-full aspect-square rounded-lg object-cover" />
                </div>
              </div>
            </div>

            {/* Example 2 - Male */}
            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-sm font-bold">DK</div>
                <div>
                  <p className="font-semibold">David Kim</p>
                  <p className="text-xs text-gray-500">Tech Entrepreneur</p>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">Original</p>
                  <img src="/examples/ex1-original.jpg" alt="Original" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">⚔️ Anime</p>
                  <img src="/examples/ex1-anime.jpg" alt="Anime" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🖼️ Oil Painting</p>
                  <img src="/examples/ex1-q-anime.jpg" alt="Oil Painting" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🤖 Cyberpunk</p>
                  <img src="/examples/ex1-cyberpunk.jpg" alt="Cyberpunk" className="w-full aspect-square rounded-lg object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">🎮 3D</p>
                  <img src="/examples/ex1-3d.jpg" alt="3D" className="w-full aspect-square rounded-lg object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. PRICING TEASER ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-3">Simple pricing</p>
          <h3 className="text-3xl md:text-4xl font-black mb-6">
            Start free, upgrade when you&apos;re hooked
          </h3>
          <p className="text-gray-400 mb-12 max-w-lg mx-auto">
            2 free generations to try it out. After that, plans start at $4.99/month — less than a coffee for unlimited AI portraits.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-10">
            <div className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.06] text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Free</p>
              <p className="text-4xl font-black mb-1">$0</p>
              <p className="text-sm text-gray-500 mb-4">forever</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> 2 generations</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> 4 styles each time</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Watermarked output</li>
              </ul>
            </div>
            <div className="bg-cyan-500/[0.08] rounded-2xl p-6 border border-cyan-500/20 text-left relative">
              <span className="absolute -top-3 left-6 text-xs bg-cyan-500 text-black px-3 py-1 rounded-full font-bold">POPULAR</span>
              <p className="text-xs uppercase tracking-wider text-cyan-400 mb-2">Unlimited</p>
              <p className="text-4xl font-black mb-1">$4.99<span className="text-lg text-gray-500 font-normal">/mo</span></p>
              <p className="text-sm text-gray-500 mb-4">billed monthly</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span> Unlimited generations</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span> No watermark</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span> Priority queue</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">✓</span> Premium styles coming</li>
              </ul>
            </div>
          </div>
          
          <a href="/pricing" className="inline-block text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
            See all plans →
          </a>
        </div>
      </section>

      {/* ==================== 10. UPLOAD SECTION (Functional) ==================== */}
      <section id="upload-section" className="py-20 px-4 bg-white/[0.02] border-t border-white/5 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          {!uploadedImage ? (
            <div className="max-w-xl mx-auto">
              {/* Gender Selection */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-4">First, pick your style set</p>
                <div className="inline-flex gap-3">
                  <button
                    onClick={() => setGender("female")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all text-base ${
                      gender === "female"
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                        : "bg-white/[0.06] text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    👩 Female
                  </button>
                  <button
                    onClick={() => setGender("male")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all text-base ${
                      gender === "male"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/[0.06] text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    👨 Male
                  </button>
                </div>
              </div>

              {/* Style Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {styleCards.map((style) => (
                  <div 
                    key={style.key}
                    className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]"
                  >
                    <div className="text-2xl mb-2">{style.emoji}</div>
                    <h4 className="font-semibold text-sm mb-1">{style.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{style.description}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-gray-600 mb-5">
                Now upload your selfie
                {remainingUses > 0 && (
                  <span className="ml-2 text-cyan-400 font-medium">({remainingUses} free trial{remainingUses > 1 ? 's' : ''} left)</span>
                )}
                {remainingUses <= 0 && (
                  <span className="ml-2 text-red-400">(No free trials left — <a href="/pricing" className="underline">subscribe</a>)</span>
                )}
              </p>

              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-cyan-500/40 hover:bg-cyan-500/[0.03] transition-all">
                  <div className="text-5xl mb-3">📸</div>
                  <p className="text-lg mb-2">Drop your photo here or click to upload</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP • Max 10MB • Face required</p>
                  <div className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-semibold transition-colors">
                    Choose Photo
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Original Image */}
              <div className="text-center">
                <h3 className="text-sm text-gray-500 mb-2">Original Photo</h3>
                <img
                  src={uploadedImage}
                  alt="Original"
                  className="max-w-[200px] mx-auto rounded-xl shadow-2xl"
                />
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                  <p className="text-xl">{progress || "Generating your styles..."}</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 1-2 minutes</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-red-400">{error}</p>
                    <button
                      onClick={handleReset}
                      className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Results - 4 Styles */}
              {!isProcessing && styles.anime && (
                <div className="space-y-6">
                  <h3 className="text-2xl text-center font-bold">Your Four Faces</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {styleCards.map((style) => (
                      <div 
                        key={style.key}
                        className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{style.emoji} {style.name}</span>
                        </div>
                        {styles[style.key] ? (
                          <>
                            <img
                              src={styles[style.key]!}
                              alt={style.name}
                              className="w-full aspect-square object-cover rounded-lg shadow-lg mb-2"
                            />
                            <button
                              onClick={() => handleDownload(styles[style.key]!, `absolute-two-face-${style.key}.png`)}
                              className="w-full py-2 text-sm bg-white/[0.08] hover:bg-white/[0.15] rounded-lg transition-colors"
                            >
                              Download
                            </button>
                          </>
                        ) : (
                          <div className="aspect-square flex items-center justify-center text-gray-500 text-sm">
                            Failed
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Try Again Button */}
                  <div className="text-center pt-6">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Upload Another Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Ready to see your<br /><span className="text-cyan-400">four faces?</span>
          </h3>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Upload one photo. Get four AI styles. It takes about a minute and your first two are free.
          </p>
          <button
            onClick={scrollToUpload}
            className="inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.03] shadow-lg shadow-cyan-500/25"
          >
            Try Free Now →
          </button>
          <p className="text-xs text-gray-600 mt-4">No signup required. No credit card.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-gray-600 text-sm">
        <p className="mb-1">© 2026 Absolute Two Face</p>
        <p className="text-xs text-gray-700">Powered by InstantID AI</p>
      </footer>
    </main>
  );
}
