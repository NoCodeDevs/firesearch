import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startup Research - Market Intelligence Platform",
  description: "AI-powered market research and validation platform for startups",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              margin: 0;
              padding: 0;
              min-height: 100vh;
            }
            * {
              box-sizing: border-box;
            }
          `
        }} />
      </head>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-full w-full font-sans antialiased bg-slate-950 text-slate-100",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
