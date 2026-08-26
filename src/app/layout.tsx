import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gemora Fine Gems",
  description:
    "Certified loose gemstones and fine jewelry, ethically sourced and curated for timeless beauty.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-primary-dark">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
