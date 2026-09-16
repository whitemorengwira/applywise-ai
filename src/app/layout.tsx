import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ApplyWise AI — Autonomous Job Application Operating System",
    template: "%s | ApplyWise AI",
  },
  description:
    "Enterprise AI-powered career platform for technology leaders. Grounded ATS tailoring, pgvector career copilot, multi-model AI routing, and application CRM.",
  keywords: [
    "AI Job Application",
    "ATS Resume Optimizer",
    "CV Tailoring",
    "Career Copilot",
    "RAG Vector Search",
    "LangGraph Agents",
    "Tech Architecture",
    "Whitemore Ngwira",
  ],
  authors: [{ name: "Whitemore Ngwira (N. White)" }],
  openGraph: {
    title: "ApplyWise AI — Autonomous Job Application Operating System",
    description:
      "Enterprise AI-powered career platform: Grounded CV tailoring, pgvector career copilot, and autonomous pipeline CRM.",
    url: "https://applywise-ai.vercel.app",
    siteName: "ApplyWise AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyWise AI — Autonomous Job Application Operating System",
    description:
      "Enterprise AI-powered career platform for technology leaders and senior architects.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
