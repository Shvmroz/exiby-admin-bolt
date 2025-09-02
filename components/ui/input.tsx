'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0077ED',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '14px',
  },
}));

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <StyledTextField
        inputRef={ref}
        variant="outlined"
        fullWidth
        size="small"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };