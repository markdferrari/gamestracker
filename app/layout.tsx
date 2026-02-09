import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ui/ToastProvider";
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
        <ToastProvider>
          <Header />
          {children}
          <footer className="border-t border-zinc-200/70 bg-white/80 py-6 dark:border-zinc-800/80 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-8">
              <div>
                <a href="https://www.whencaniwatchit.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-700 hover:text-sky-500 dark:text-zinc-300 dark:hover:text-sky-400 transition">
                  Like Movies? - Visit WhenCanIWatchIt.com →
                </a>
              </div>
              <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                Data provided by <a href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer" className="underline">IGDB</a>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
