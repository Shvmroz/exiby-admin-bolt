'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Button } from './button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="sm" fullWidth>
        {children}
      </Dialog>
    </AlertDialogContext.Provider>
  );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children }) => {
  return <>{children}</>;
};

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children }) => {
  return <>{children}</>;
};

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => {
  return (
    <DialogActions sx={{ padding: '16px 24px' }}>
      {children}
    </DialogActions>
  );
};

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children, className }) => {
  return (
    <DialogTitle sx={{ padding: '24px 24px 8px 24px' }}>
      {children}
    </DialogTitle>
  );
};

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children, className }) => {
  return (
    <DialogContent sx={{ padding: '0 24px 16px 24px' }}>
      <DialogContentText>
        {children}
      </DialogContentText>
    </DialogContent>
  );
};

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children, onClick, disabled, className }) => {
  return (
    <Button onClick={onClick} disabled={disabled} variant="default">
      {children}
    </Button>
  );
};

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, disabled, className }) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  
  return (
    <Button onClick={() => onOpenChange(false)} disabled={disabled} variant="outline">
      {children}
    </Button>
  );
};

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};