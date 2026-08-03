import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(adminUrl),
  title: "caguei Admin Console",
  description: "Internal administration console for caguei — product catalog, orders and fulfillment.",
  icons: {
    icon: '/icon.png',
  },
  // Internal tool behind a superadmin access code — never index it, in dev or prod.
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#141313] text-[#FFFFFF] font-sans selection:bg-[#C23B3B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
