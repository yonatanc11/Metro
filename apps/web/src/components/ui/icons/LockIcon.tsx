import { strokeIconProps } from './iconDefaults';

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
