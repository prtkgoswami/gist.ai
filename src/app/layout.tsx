import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gist.ai - Find the Gist any Public Internet Article",
  description:
    "Gist.ai allows you to input any publicly available article URL and instantly fetch the title, author, summary, references, metrics, and sentiment analysis. Get insights in seconds.",
  keywords:
    "Gist.ai, article summarizer, article analysis, title extraction, author extraction, article summary, references, metrics, sentiment analysis, article insights, content analysis, gist, pratik",
  authors: [{ name: "Pratik Goswami" }],
  robots: "index, follow",
  openGraph: {
    title: "Gist.ai - Find the Gist any Public Internet Article",
    description:
      "Gist.ai allows you to input any publicly available article URL and instantly fetch the title, author, summary, references, metrics, and sentiment analysis. Get insights in seconds.",
    url: "https://gistai.vercel.app",
    siteName: "Gist.ai",
    images: [],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://gistai.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
