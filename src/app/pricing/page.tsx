"use client";

import { useState } from "react";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "",
    planKey: "free",
    description: "Try it once, see the magic",
    features: [
      "2 free generations",
      "4 AI styles",
      "With watermark",
      "Standard resolution",
    ],
    limitations: [
      "Limited to 2 uses",
      "Watermark on images",
    ],
    cta: "Try Free",
    popular: false,
  },
  {
    name: "Monthly",
    price: "$4.99",
    period: "/month",
    planKey: "monthly",
    description: "Unlimited creativity, cancel anytime",
    features: [
      "Unlimited generations",
      "4 AI styles + more coming",
      "No watermark",
      "High resolution",
      "Priority processing",
      "Male & Female modes",
    ],
    limitations: [],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    name: "Yearly",
    price: "$29.99",
    period: "/year",
    planKey: "yearly",
    description: "Best value, save $30",
    features: [
      "Everything in Monthly",
      "All future styles",
      "Early access to new features",
      "Priority support",
    ],
    limitations: [],
    cta: "Get Yearly",
    popular: false,
    badge: "Save 50%",
  },
];

export default function PricingPage() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    if (planKey === "free") {
      window.location.href = "/";
      return;
    }

    setLoading(planKey);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="py-4 px-4 border-b border-white/10 sticky top-0 bg-black/50 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Absolute Two Face
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Try free. Subscribe when you love it. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                plan.popular
                  ? "border-cyan-500 bg-cyan-500/10 scale-105 shadow-2xl shadow-cyan-500/20"
                  : "border-white/10 bg-white/5"
              } ${hoveredPlan === plan.name ? "translate-y-[-4px]" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              {/* Save Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.planKey)}
                disabled={loading === plan.planKey}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all mb-6 ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg"
                    : "bg-white/10 hover:bg-white/20 text-white"
                } ${loading === plan.planKey ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading === plan.planKey ? "Redirecting to Stripe..." : plan.cta}
              </button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-center gap-2 text-sm text-gray-500">
                    <span>✗</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your subscription anytime with one click. No questions asked.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and Apple Pay / Google Pay via Stripe.",
              },
              {
                q: "What happens after the free trial?",
                a: "After your 2 free generations, you'll be prompted to subscribe. Your free images are yours to keep!",
              },
              {
                q: "How long does generation take?",
                a: "Usually 1-2 minutes for all 4 styles. Subscribers get priority processing.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 7-day money-back guarantee for all subscriptions.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-white/5 rounded-xl p-5 border border-white/10"
              >
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center text-gray-500 text-sm">
        <p className="mb-2">© 2026 Absolute Two Face. All rights reserved.</p>
        <p className="text-xs">Powered by InstantID AI • Made with ❤️</p>
      </footer>
    </main>
  );
}
