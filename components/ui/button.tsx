'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  fontWeight: 500,
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#0077ED',
    '&:hover': {
      backgroundColor: '#0066CC',
    },
  },
  '&.MuiButton-outlinedPrimary': {
    borderColor: '#0077ED',
    color: '#0077ED',
    '&:hover': {
      borderColor: '#0066CC',
      backgroundColor: 'rgba(0, 119, 237, 0.04)',
    },
  },
}));

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', children, ...props }, ref) => {
    const getMuiVariant = () => {
      switch (variant) {
        case 'outline':
          return 'outlined';
        case 'ghost':
        case 'link':
          return 'text';
        case 'destructive':
          return 'contained';
        default:
          return 'contained';
      }
    };

    const getMuiColor = () => {
      switch (variant) {
        case 'destructive':
          return 'error';
        case 'secondary':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const getMuiSize = () => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'lg':
          return 'large';
        default:
          return 'medium';
      }
    };

    return (
      <StyledButton
        ref={ref}
        variant={getMuiVariant()}
        color={getMuiColor()}
        size={getMuiSize()}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };