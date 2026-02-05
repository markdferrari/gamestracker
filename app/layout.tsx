import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhenCanIPlayIt.com",
  description: "Track upcoming game releases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <footer className="border-t border-zinc-200 bg-white/80 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
          Data provided by IGDB
        </footer>
      </body>
    </html>
  );
}
