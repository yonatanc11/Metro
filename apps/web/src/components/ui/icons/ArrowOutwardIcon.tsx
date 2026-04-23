export function ArrowOutwardIcon({
  className = 'h-5 w-5',
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`${className} fill-current`}
    >
      <path d="M6 17.59L15.17 8.41H7V6h12v12h-2.41V9.83L7.41 19z" />
    </svg>
  );
}
