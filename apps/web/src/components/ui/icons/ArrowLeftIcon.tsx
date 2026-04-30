export function ArrowLeftIcon({
  className = 'h-4 w-4',
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`${className} fill-current`}
    >
      <path d="M12 4l1.41 1.41L7.83 11H20v2H7.83l5.58 5.59L12 20l-8-8z" />
    </svg>
  );
}
