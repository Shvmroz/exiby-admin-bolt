import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
          'bg-white text-gray-900 placeholder-gray-400 border-gray-300 ' + // light mode
          'dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 ' + // dark mode
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
