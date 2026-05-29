import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hentak. — Nouvelle Manipuri Cuisine, Imphal",
    template: "%s | Hentak.",
  },
  description:
    "A contemporary dining experience rooted in the ancient fermented food traditions of Manipur.",
  openGraph: {
    title: "Hentak. — Nouvelle Manipuri Cuisine",
    description: "The soul of the Meitei kitchen, reimagined.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${nunito.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
