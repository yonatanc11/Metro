import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHomepage } from '@/lib/cms/homepage';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  if (!homepage?.seo) return { title: 'Metro' };
  return {
    title: homepage.seo.metaTitle ?? 'Metro',
    description: homepage.seo.metaDescription ?? undefined,
  };
}

export default async function HomePage() {
  const homepage = await getHomepage();
  if (!homepage) notFound();
  return (
    <main>
      <SectionRenderer sections={homepage.sections} />
    </main>
  );
}
