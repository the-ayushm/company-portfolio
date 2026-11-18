import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Analytics } from "@/components/layout/analytics";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-serif-face", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand.name} — Custom Software, ERP, CRM & WhatsApp Automation`,
    template: `%s — ${siteConfig.brand.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.brand.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.brand.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.brand.name,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: siteConfig.brand.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} data-intro="playing" suppressHydrationWarning>
      <body className="min-h-dvh">
        <noscript>
          <style>{`main *{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
