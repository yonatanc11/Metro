import { CartView } from './_components/CartView';

export const metadata = {
  title: 'Cart — Metro',
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12 md:px-12">
      <CartView />
    </main>
  );
}
