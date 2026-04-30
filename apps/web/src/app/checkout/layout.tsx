import type { Metadata } from 'next';
import { strings } from '@/strings';
import { CheckoutHeader } from './_components/CheckoutHeader';

export const metadata: Metadata = {
  title: strings.checkout.metaTitle,
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckoutHeader />
      {children}
    </>
  );
}
