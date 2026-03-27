import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Absolute Two Face - AI Face Style Generator",
  description: "Upload a face photo and generate two different style versions instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
