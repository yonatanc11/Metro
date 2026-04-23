import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  'aria-label': string;
  children: ReactNode;
};

export function IconButton({
  children,
  className = '',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
