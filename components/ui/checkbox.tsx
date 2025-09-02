'use client';

import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  color: '#0077ED',
  '&.Mui-checked': {
    color: '#0077ED',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
}));

export interface CheckboxProps extends MuiCheckboxProps {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <StyledCheckbox
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };