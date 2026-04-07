import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia",
  });
}

const PLANS: Record<string, { name: string; price: number; interval: "month" | "year" }> = {
  monthly: { name: "Absolute Two Face - Monthly", price: 499, interval: "month" },
  yearly: { name: "Absolute Two Face - Yearly", price: 2999, interval: "year" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const plan = body.plan || "monthly";

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planConfig.name,
              description: "Unlimited AI face style generations",
            },
            unit_amount: planConfig.price,
            recurring: {
              interval: planConfig.interval,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?subscribed=true`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
