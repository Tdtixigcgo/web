import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={clsx(
        'rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50',
        {
          'bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900': variant === 'primary',
          'border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-500': variant === 'danger'
        },
        className
      )}
      {...props}
    />
  );
}
