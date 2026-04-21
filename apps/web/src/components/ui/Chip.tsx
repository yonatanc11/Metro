import type { HTMLAttributes } from 'react';

type Tone = 'secondary' | 'surface';

type Props = {
  tone?: Tone;
} & HTMLAttributes<HTMLSpanElement>;

const base =
  'inline-block rounded-full px-3 py-1 font-label text-xs font-bold uppercase tracking-widest md:px-4 md:py-1.5';

const tones: Record<Tone, string> = {
  secondary:
    'border border-outline-variant/20 bg-secondary-container text-on-secondary-container shadow-lg',
  surface: 'bg-surface-container-low text-on-surface-variant',
};

export function Chip({ tone = 'secondary', className = '', ...props }: Props) {
  return (
    <span {...props} className={`${base} ${tones[tone]} ${className}`} />
  );
}
