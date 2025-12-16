import React from 'react';
import { cn } from '../../lib/utils';

const baseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-indigo-500 focus-visible:ring-offset-background';

const variants = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline:
    'border border-input bg-transparent hover:bg-indigo-50 text-gray-900',
  ghost: 'hover:bg-indigo-50 text-gray-900',
};

export function Button({
  className,
  variant = 'default',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        'px-4 py-2',
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}


