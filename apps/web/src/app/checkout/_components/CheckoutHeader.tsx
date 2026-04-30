import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/ui/icons';
import { strings } from '@/strings';

export function CheckoutHeader() {
  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/90 px-8 py-6 backdrop-blur-xl">
      <Link
        href="/"
        className="group flex items-center gap-2 text-on-background transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-headline text-sm font-bold uppercase tracking-widest">
          {strings.checkout.backToShop}
        </span>
      </Link>
      <div className="font-headline text-2xl font-black italic tracking-tighter text-on-background">
        {strings.brand.wordmark}
      </div>
      <div className="w-24" />
    </header>
  );
}
