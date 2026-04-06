"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Absolute Two Face!</h1>
        <p className="text-gray-300 mb-2">
          Your subscription is now active. You have unlimited access to all features.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Session ID: {sessionId || "N/A"}
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-teal-600 transition-all"
        >
          Start Creating →
        </a>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p>Processing your payment...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
