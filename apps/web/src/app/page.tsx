import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHomepage } from '@/lib/cms/homepage';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { strings } from '@/strings';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  if (!homepage?.seo) return { title: strings.brand.name };
  return {
    title: homepage.seo.metaTitle ?? strings.brand.name,
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
