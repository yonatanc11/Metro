import { strings } from '@/strings';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-neutral-600">{strings.notFound.message}</p>
      </div>
    </main>
  );
}
