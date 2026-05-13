
import type { Metadata } from 'next';
import './globals.css';
import { Alegreya, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'BovIntelligence AI | Professional Bovine Insights',
  description: 'AI-driven cattle breed classification and genomic health management platform.',
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${alegreya.className} font-body antialiased selection:bg-accent/30`}>
        {children}
      </body>
    </html>
  );
}
