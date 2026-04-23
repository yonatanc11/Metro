import { ArrowRightIcon } from '@/components/ui/icons';

type Props = {
  heading: string;
  subheading?: string | null;
  viewAllLabel?: string | null;
  viewAllHref?: string | null;
};

export function SectionHeader({
  heading,
  subheading,
  viewAllLabel,
  viewAllHref,
}: Props) {
  const hasViewAll = Boolean(viewAllLabel && viewAllHref);
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8">
      <div>
        <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface md:text-4xl">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 font-body text-on-surface-variant">{subheading}</p>
        )}
      </div>
      {hasViewAll && (
        <a
          href={viewAllHref as string}
          className="inline-flex items-center gap-1 self-start border-b border-primary/30 pb-1 font-headline font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-container md:self-auto"
        >
          {viewAllLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
