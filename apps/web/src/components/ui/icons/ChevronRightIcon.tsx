import { strokeIconProps } from './iconDefaults';

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
