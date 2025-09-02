'use client';

import React from 'react';
import {
  Menu,
  MenuItem,
  MenuProps,
  Divider,
} from '@mui/material';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownMenuSeparatorProps {}

const DropdownMenuContext = React.createContext<{
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
}>({
  anchorEl: null,
  setAnchorEl: () => {},
});

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ anchorEl, setAnchorEl }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, asChild }) => {
  const { setAnchorEl } = React.useContext(DropdownMenuContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    });
  }

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, align = 'start' }) => {
  const { anchorEl, setAnchorEl } = React.useContext(DropdownMenuContext);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAnchorOrigin = () => {
    switch (align) {
      case 'end':
        return { vertical: 'bottom' as const, horizontal: 'right' as const };
      case 'center':
        return { vertical: 'bottom' as const, horizontal: 'center' as const };
      default:
        return { vertical: 'bottom' as const, horizontal: 'left' as const };
    }
  };

  const getTransformOrigin = () => {
    switch (align) {
      case 'end':
        return { vertical: 'top' as const, horizontal: 'right' as const };
      case 'center':
        return { vertical: 'top' as const, horizontal: 'center' as const };
      default:
        return { vertical: 'top' as const, horizontal: 'left' as const };
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={getAnchorOrigin()}
      transformOrigin={getTransformOrigin()}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          minWidth: '8rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {children}
    </Menu>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick, className }) => {
  const { setAnchorEl } = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    onClick?.();
    setAnchorEl(null);
  };

  return (
    <MenuItem onClick={handleClick} sx={{ fontSize: '14px', padding: '8px 16px' }}>
      {children}
    </MenuItem>
  );
};

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = () => {
  return <Divider />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};