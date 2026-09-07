import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import "./globals.scss";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Basel Abushab — Software Engineer",
  description:
    "Full-Stack Software Engineer specializing in scalable systems, clean architecture, and modern web applications.",
  keywords: [
    "Basel Abushab",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "Systems Architecture",
  ],
  authors: [{ name: "Basel Abushab" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
