import { strokeIconProps } from './iconDefaults';

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
