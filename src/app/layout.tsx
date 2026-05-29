import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Hentak. — Nouvelle Manipuri Cuisine, Imphal",
    template: "%s | Hentak.",
  },
  description:
    "A contemporary dining experience rooted in the ancient fermented food traditions of Manipur. Hentak, ngari, singju — the soul of the Meitei kitchen, reimagined.",
  keywords: ["Hentak", "Manipuri cuisine", "Imphal restaurant", "Northeast India food", "Nouvelle Manipuri", "fermented fish"],
  openGraph: {
    title: "Hentak. — Nouvelle Manipuri Cuisine",
    description: "The soul of the Meitei kitchen, reimagined.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-paper text-ink-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
