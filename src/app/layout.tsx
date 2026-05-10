import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

import { MobileNavbar } from "@/components/MobileNavbar";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-bodoni",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "NOIR | Premium Spirits & Fine Wines",
  description: "Experience the world's most exceptional spirits and wines. Delivered with uncompromising quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${bodoni.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-black">
        <Navbar />
        <main className="flex-1 pb-24 lg:pb-0">
          {children}
        </main>
        <MobileNavbar />
      </body>
    </html>
  );
}
