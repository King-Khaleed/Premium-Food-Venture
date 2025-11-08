import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Playfair_Display, Cormorant_Garamond, Inter, Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cormorant-garamond',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Premium Food Venture',
  description: 'Premium Quality, Unbeatable Freshness. Its premium services or nothing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={cn(
        "font-body antialiased",
        playfairDisplay.variable,
        cormorantGaramond.variable,
        inter.variable,
        montserrat.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
