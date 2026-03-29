import { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'min-h-24 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-gray-300 focus:ring dark:border-gray-700 dark:bg-gray-900',
        className
      )}
      {...props}
    />
  );
}
