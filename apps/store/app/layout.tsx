import type { Metadata } from 'next';
import { Anton, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { GlobalStoreProvider } from '../lib/context/store-context';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-collegiate',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const siteName = 'caguei';
const siteDescription = 'Streetwear vintage/collegiate — bordô, verde-oliva, marinho e cru.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | streetwear feito para durar`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} | streetwear feito para durar`,
    description: siteDescription,
    url: siteUrl,
    images: [{ url: '/brand/logo-wordmark.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | streetwear feito para durar`,
    description: siteDescription,
    images: ['/brand/logo-wordmark.png'],
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
      className={`${anton.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background font-body-md overflow-x-hidden">
        <GlobalStoreProvider>
          <Header />
          <div className="flex flex-col flex-1">
            {children}
          </div>
          <Footer />
        </GlobalStoreProvider>
      </body>
    </html>
  );
}
