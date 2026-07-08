import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DemoBanner } from "@/components/layout/demo-banner";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "escort.demo — German companion marketplace (portfolio demo)",
  description:
    "A portfolio demo of a compliant escort/companion marketplace for Germany. Fictional data, mock payments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-[100dvh]">
        <DemoBanner />
        <Navbar />
        <main>{children}</main>
        <footer className="mt-16 border-t border-app">
          <div className="mx-auto max-w-[1200px] px-4 py-8 text-xs text-muted">
            <p className="max-w-2xl">
              This is a fictional portfolio project demonstrating a marketplace compliant with
              Germany&apos;s Prostituiertenschutzgesetz (ProstSchG). No real people, no real
              transactions, no real identity verification.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a href="/legal/terms" className="hover:text-fg">Terms</a>
              <a href="/legal/privacy" className="hover:text-fg">Privacy</a>
              <a href="/legal/prostschg-info" className="hover:text-fg">ProstSchG info</a>
              <a href="/safety" className="hover:text-fg">Safety &amp; verification</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
