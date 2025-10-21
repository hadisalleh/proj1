import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout';
import { SessionProvider } from '@/components/providers/SessionProvider';
// import PerformanceProvider from '@/components/providers/PerformanceProvider';
// import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FishTrip - Find Your Perfect Fishing Adventure',
  description: 'Discover and book amazing fishing trips around the world. Compare prices, read reviews, and find the perfect fishing experience for you.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FishTrip',
  },
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'FishTrip',
    title: 'FishTrip - Find Your Perfect Fishing Adventure',
    description: 'Discover and book amazing fishing trips around the world. Compare prices, read reviews, and find the perfect fishing experience for you.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishTrip - Find Your Perfect Fishing Adventure',
    description: 'Discover and book amazing fishing trips around the world. Compare prices, read reviews, and find the perfect fishing experience for you.',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'FishTrip',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-tap-highlight': 'no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
