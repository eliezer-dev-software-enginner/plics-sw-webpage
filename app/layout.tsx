import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plics-SW',
  description: 'Sistema ERP completo e totalmente offline',
  applicationName: 'Plics-SW',
  keywords:
    'plics, pliqs, plics-sw, erp, erp offline, erp sem internet, controle de estoque, sistema para gerenciar negócio, sistema de computador para pequenos negócios',
  openGraph: {
    type: 'website',
    url: 'https://plics-sw-webpage.vercel.app',
    title: 'Plics-SW Sistema ERP completo para pequenos negócios',
    description: 'Sistema ERP completo e totalmente offline',
    siteName: 'Plics-SW',
    // images: [{ url: 'https://example.com/og.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
