import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A+Market — Fresh Premium Chicken | Pretoria',
  description:
    'Premium fresh chicken delivered to your door in Pretoria. Nuggets, Strips, Patties, Pops & Schnitzel. Order by Friday, delivered Saturday.',
  keywords: 'fresh chicken, Pretoria, delivery, nuggets, strips, schnitzel, A+Market',
  openGraph: {
    title: 'A+Market — Fresh Premium Chicken',
    description: 'Order by Friday. Delivered Saturday. Pretoria's finest fresh chicken.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#2C1810',
              color: '#FFF8F0',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#FF6B35', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
