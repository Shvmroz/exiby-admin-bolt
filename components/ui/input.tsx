import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full h-10 px-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white',
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
