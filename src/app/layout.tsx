import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
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
