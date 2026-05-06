import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://sakuku.vercel.app"),
  title: {
    default: "SakuKu | Kelola Keuangan Pribadi dengan Cerdas",
    template: "%s | SakuKu",
  },
  description: "Dashboard finansial premium untuk memantau pengeluaran, tagihan, dan target tabungan Anda dengan gaya Midnight Premium.",
  keywords: ["keuangan", "budgeting", "tabungan", "expense tracker", "finansial"],
  authors: [{ name: "SakuKu Team" }],
  alternates: {
    canonical: "https://sakuku.vercel.app",
  },
  openGraph: {
    title: "SakuKu - Financial Freedom in Your Pocket",
    description: "Pantau kesehatan finansial Anda dengan dashboard modern dan interaktif.",
    url: "https://sakuku.vercel.app",
    siteName: "SakuKu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SakuKu Financial Dashboard",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SakuKu | Smart Financial Dashboard",
    description: "Kelola uang lebih bijak dengan desain Midnight Premium.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    title: "SakuKu",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
          <Toaster position="top-right" expand={true} closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
