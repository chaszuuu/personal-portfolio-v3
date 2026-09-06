import type { Metadata } from "next";
import { Syne, Manrope, Inter, JetBrains_Mono } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230B0C0E'/%3E%3Ctext x='16' y='22' font-family='Manrope, sans-serif' font-weight='700' font-size='14' fill='%23A6E22E' text-anchor='middle'%3ECP%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "Charles Vincent Panlilio",
  description:
    "Full-stack & mobile developer. BS Information Technology, Pampanga State University. Building Yomuzuu, AttachMates, and other projects.",
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    title: "Charles Vincent Panlilio",
    description:
      "Full-stack & mobile developer. BS Information Technology, Pampanga State University.",
  },
  twitter: {
    card: "summary",
    title: "Charles Vincent Panlilio",
    description:
      "Full-stack & mobile developer. BS Information Technology, Pampanga State University.",
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
        className={`${syne.variable} ${manrope.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}