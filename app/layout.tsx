import type { Metadata } from "next";
import { Syne, Manrope, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://charlesvincentpanlilio.vercel.app"; // swap in your real URL after deploying
const FAVICON = "/projects/frieren.png";
const OG_IMAGE = "/branding/og-image.png";
const TITLE = "Charles Vincent Panlilio | Full-Stack & Mobile Developer";
const DESCRIPTION =
  "Developer who ships full-stack web and mobile apps. Browse my projects, stack and experience.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Charles Vincent Panlilio",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Charles Vincent Panlilio logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${manrope.variable} ${jetBrainsMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}