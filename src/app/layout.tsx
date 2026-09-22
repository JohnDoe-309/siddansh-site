import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Telemetry } from "@/components/Telemetry";
import { person } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siddansh.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: person.name,
  description: `${person.headline} Operator who builds: fractional operations and automation.`,
  openGraph: {
    title: person.name,
    description: person.headline,
    url: siteUrl,
    siteName: person.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: person.name, description: person.headline },
};

export const viewport: Viewport = { themeColor: "#08090b", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {children}
        <Telemetry />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
