import type { Metadata } from 'next';
import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { GlobalStoreProvider } from '../lib/context/store-context';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CAGUEI | THE NEW STANDARD',
  description: 'Premium European streetwear anchored in Swiss precision and Japanese minimalism.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${hankenGrotesk.variable} h-full antialiased`}
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
