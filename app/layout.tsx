import type { Metadata } from 'next';
import { Montserrat, Fraunces } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/components/CartProvider';
import ScrollToTop from '@/components/ScrollToTop';
import JsonLd from '@/components/JsonLd';
import { siteGraphSchema } from '@/lib/schema';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://biggsbakes.com'),
  title: 'Biggs Bakes | NYC-Inspired Cookies, Baked in Britain',
  description:
    'Thick, gooey, NYC-inspired cookies baked fresh in the UK. Build your own box of 3 from six signature flavours.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Biggs Bakes | NYC-Inspired Cookies, Baked in Britain',
    description:
      'Thick, gooey, NYC-inspired cookies baked fresh in the UK. Build your own box of 3 from six signature flavours.',
    url: 'https://biggsbakes.com',
    siteName: 'Biggs Bakes',
    images: [
      {
        url: '/images/opengraph.jpg',
        width: 1200,
        height: 630,
        alt: 'Biggs Bakes cookies',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biggs Bakes | NYC-Inspired Cookies, Baked in Britain',
    description:
      'Thick, gooey, NYC-inspired cookies baked fresh in the UK. Build your own box of 3 from six signature flavours.',
    images: ['/images/opengraph.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${montserrat.variable} ${fraunces.variable}`}>
      <body className="font-sans font-semibold antialiased">
        <JsonLd data={siteGraphSchema()} />
        <CartProvider>
          <ScrollToTop />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
