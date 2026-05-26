import type { Metadata } from "next";
import { Noto_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const serif = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: ["300", "400", "500"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Couture Private Estates — Brokerage Portal",
  description:
    "Floor plate intelligence, unit comparison, and inventory for Couture's brokerage team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-bone text-ink antialiased">
        <CurrencyProvider>
          <Header />
          <main className="pb-24">{children}</main>
          <footer className="surface-deep mt-32">
            <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-3 gap-8">
              <div>
                <div className="font-serif text-canvas text-2xl tracking-wider2">COUTURE</div>
                <div className="eyebrow-light mt-1">Private Estates</div>
                <p className="text-canvas/65 text-xs mt-4 leading-relaxed max-w-xs">
                  Brokerage portal for the Floor Plan Atlas v1.1 pipeline. Internal preview build.
                </p>
              </div>
              <div>
                <div className="eyebrow-light">Surfaces</div>
                <ul className="mt-3 space-y-1.5 text-canvas/75 text-sm">
                  <li><a href="/projects" className="hover:text-copper transition-colors">Projects</a></li>
                  <li><a href="/compare"  className="hover:text-copper transition-colors">Comparison engine</a></li>
                  <li><a href="/about"    className="hover:text-copper transition-colors">About the Atlas</a></li>
                </ul>
              </div>
              <div className="md:text-right">
                <div className="eyebrow-light">Build</div>
                <div className="text-canvas/55 text-xs mt-3">
                  Floor Plan Atlas v1.1
                </div>
                <div className="text-canvas/40 text-[10px] mt-1 uppercase tracking-wider2">
                  Internal preview · Dubai
                </div>
              </div>
            </div>
          </footer>
        </CurrencyProvider>
      </body>
    </html>
  );
}
