'use client';

import React from 'react';
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  SelectProps as MuiSelectProps,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  '& .MuiSelect-select': {
    padding: '12px 14px',
    fontSize: '14px',
  },
}));

interface SelectProps extends Omit<MuiSelectProps, 'children'> {
  children: React.ReactNode;
  placeholder?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface SelectContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return <>{children}</>;
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className, style }) => {
  return null; // This will be handled by the parent Select component
};

const SelectContent: React.FC<SelectContentProps> = ({ children, style }) => {
  return <>{children}</>;
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  return <MenuItem value={value}>{children}</MenuItem>;
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return null; // This will be handled by the parent Select component
};

// Main Select component that combines everything
const SelectComponent = React.forwardRef<HTMLSelectElement, {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}>(({ value, onValueChange, children, disabled, required, placeholder, style }, ref) => {
  // Extract SelectItem components from children
  const items: React.ReactElement[] = [];
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === SelectContent) {
        React.Children.forEach(child.props.children, (contentChild) => {
          if (React.isValidElement(contentChild) && contentChild.type === SelectItem) {
            items.push(contentChild);
          }
        });
      }
    }
  });

  return (
    <StyledFormControl fullWidth size="small" style={style}>
      <MuiSelect
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        required={required}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: '#9ca3af' }}>{placeholder}</span>;
          }
          const selectedItem = items.find(item => item.props.value === selected);
          return selectedItem?.props.children || selected;
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {items}
      </MuiSelect>
    </StyledFormControl>
  );
});

SelectComponent.displayName = 'Select';

export {
  SelectComponent as Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
};