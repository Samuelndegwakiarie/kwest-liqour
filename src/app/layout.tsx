import type { Metadata } from "next";
import { Bodoni_Moda, Jost, Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ReviewProvider } from "@/context/ReviewContext";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KWEST LUXURY SPIRITS | Nairobi's Premier Boutique",
  description:
    "Curated luxury spirits and fine wines delivered with uncompromising quality in Nairobi. Experience rare bottles handpicked for the discerning palate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${bodoni.variable} ${jost.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <CartProvider>
            <ReviewProvider>
              <ClientLayoutWrapper>
                {children}
              </ClientLayoutWrapper>
            </ReviewProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


