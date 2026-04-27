import { strokeIconProps } from './iconDefaults';

export function MinusIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}
