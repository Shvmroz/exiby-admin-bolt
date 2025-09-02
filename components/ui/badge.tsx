'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: 600,
  height: '24px',
  '& .MuiChip-label': {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

export interface BadgeProps extends Omit<ChipProps, 'variant'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const getMuiVariant = () => {
      switch (variant) {
        case 'outline':
          return 'outlined';
        default:
          return 'filled';
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

    return (
      <StyledChip
        ref={ref}
        variant={getMuiVariant()}
        color={getMuiColor()}
        size="small"
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };