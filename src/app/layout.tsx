import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://absolutetwoface.shop";

export const metadata: Metadata = {
  verification: {
    google: "google79863889b00e9d5b",
  },
  title: {
    default: "Absolute Two Face - AI Face Style Generator | Anime, Cyberpunk, 3D Portraits",
    template: "%s | Absolute Two Face",
  },
  description:
    "Upload one photo, get 4 AI-generated style versions of your face — anime, cyberpunk, 3D, and more. Free to try, done in ~1 minute.",
  keywords: [
    "AI face generator",
    "AI portrait",
    "anime face",
    "cyberpunk portrait",
    "AI avatar maker",
    "face style transfer",
    "InstantID",
    "AI photo editor",
  ],
  authors: [{ name: "Absolute Two Face" }],
  creator: "Absolute Two Face",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Absolute Two Face",
    title: "Absolute Two Face - See Yourself in 4 Different Styles",
    description:
      "Upload one photo. Get 4 AI-generated versions of your face — anime, cyberpunk, 3D, and more. Takes about a minute.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Absolute Two Face - AI Face Style Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Absolute Two Face - See Yourself in 4 Different Styles",
    description:
      "Upload one photo. Get 4 AI-generated versions of your face. Free to try.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Absolute Two Face",
        url: baseUrl,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        description:
          "Upload one photo, get 4 AI-generated style versions of your face — anime, cyberpunk, 3D, and more.",
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "USD",
            description: "2 free generations with watermark",
          },
          {
            "@type": "Offer",
            name: "Unlimited",
            price: "4.99",
            priceCurrency: "USD",
            billingIncrement: "P1M",
            description: "Unlimited generations, no watermark, priority queue",
          },
        ],
      },
      {
        "@type": "WebSite",
        name: "Absolute Two Face",
        url: baseUrl,
      },
    ],
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
