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
    fontSize: '14px',
  },
}));

export interface TextareaProps extends Omit<TextFieldProps, 'variant'> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    return (
      <StyledTextField
        inputRef={ref}
        variant="outlined"
        fullWidth
        multiline
        rows={rows}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };