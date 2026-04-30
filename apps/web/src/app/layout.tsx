import './global.css';
import { Space_Grotesk, Inter } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeaderShell } from '@/components/layout/HeaderShell';
import { CartProvider } from '@/lib/cart/CartProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { strings } from '@/strings';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: strings.brand.name,
  description: strings.brand.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
        <CartProvider>
          <ToastProvider>
            <HeaderShell>
              <SiteHeader />
            </HeaderShell>
            {children}
            <SiteFooter />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
