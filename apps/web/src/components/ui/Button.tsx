import type { AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

type Props = {
  variant?: Variant;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const base =
  'inline-flex items-center justify-center rounded-lg px-8 py-4 text-center font-headline font-bold uppercase tracking-wider transition-colors active:scale-95';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container',
  secondary:
    'border border-outline-variant/30 bg-surface-container-highest/80 text-on-surface backdrop-blur-md hover:bg-surface-container-high',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: Props) {
  return (
    <a {...props} className={`${base} ${variants[variant]} ${className}`} />
  );
}
