import { strokeIconProps } from './iconDefaults';

export function TruckIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <path d="M14 18V6H1v12h2" />
      <path d="M3 18h12" />
      <path d="M16 8h4l3 4v6h-2" />
      <path d="M15 18h2" />
      <circle cx="6.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}
