"use client";

import { useState } from "react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [styleA, setStyleA] = useState<string | null>(null);
  const [styleB, setStyleB] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStyleA(null);
    setStyleB(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);

      // Call API to generate styles
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Generation failed");
        }

        setStyleA(data.styleA);
        setStyleB(data.styleB);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
      {/* Header */}
      <header className="py-6 px-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Absolute Two Face
          </h1>
          <p className="text-sm text-gray-400">AI Face Style Generator</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Transform Your Face Into{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Two Styles
          </span>
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Upload a face photo and watch AI generate stunning anime and cyberpunk versions instantly
        </p>
      </section>

      {/* Upload Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {!uploadedImage ? (
            <label htmlFor="file-upload" className="block cursor-pointer">
              <div className="border-2 border-dashed border-purple-500/50 rounded-2xl p-16 text-center hover:border-purple-400 hover:bg-purple-500/5 transition-all">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-xl mb-2">Drop your photo here or click to upload</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WebP (max 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-8">
              {/* Original Image */}
              <div className="text-center">
                <h3 className="text-lg text-gray-400 mb-4">Original Photo</h3>
                <img
                  src={uploadedImage}
                  alt="Original"
                  className="max-w-xs mx-auto rounded-xl shadow-2xl"
                />
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-xl">Generating your styles...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-red-400">{error}</p>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setError(null);
                      }}
                      className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {styleA && styleB && !isProcessing && (
                <div className="space-y-8">
                  <h3 className="text-2xl text-center font-semibold">Your Two Faces</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Style A: Anime */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-purple-400">🎨 Anime Style</h4>
                        <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">Preview</span>
                      </div>
                      <img
                        src={styleA}
                        alt="Anime Style"
                        className="w-full rounded-xl shadow-lg mb-4"
                      />
                      <button
                        onClick={() => handleDownload(styleA, "absolute-two-face-anime.png")}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      >
                        Download HD (Free)
                      </button>
                    </div>

                    {/* Style B: Cyberpunk */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-cyan-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-cyan-400">🤖 Cyberpunk Style</h4>
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded-full">Preview</span>
                      </div>
                      <img
                        src={styleB}
                        alt="Cyberpunk Style"
                        className="w-full rounded-xl shadow-lg mb-4"
                      />
                      <button
                        onClick={() => handleDownload(styleB, "absolute-two-face-cyberpunk.png")}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      >
                        Download HD (Free)
                      </button>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <div className="text-center pt-8">
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setStyleA(null);
                        setStyleB(null);
                        setError(null);
                      }}
                      className="px-8 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors"
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

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">1️⃣</div>
              <h4 className="text-xl font-semibold mb-2">Upload</h4>
              <p className="text-gray-400">Upload a face photo with a clear view</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">2️⃣</div>
              <h4 className="text-xl font-semibold mb-2">Generate</h4>
              <p className="text-gray-400">AI creates two stunning style versions</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">3️⃣</div>
              <h4 className="text-xl font-semibold mb-2">Download</h4>
              <p className="text-gray-400">Download your transformed images</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 Absolute Two Face. All rights reserved.</p>
      </footer>
    </main>
  );
}
