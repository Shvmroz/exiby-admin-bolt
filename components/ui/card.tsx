'use client';

import React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
}));

const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: '24px',
  '&:last-child': {
    paddingBottom: '24px',
  },
}));

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => (
    <StyledCard ref={ref} {...props}>
      {children}
    </StyledCard>
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} style={{ padding: '24px 24px 0 24px' }} {...props}>
      {children}
    </div>
  )
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h6"
      component="h3"
      sx={{ fontWeight: 600, fontSize: '18px', lineHeight: 1.2 }}
      {...props}
    >
      {children}
    </Typography>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <StyledCardContent ref={ref} {...props}>
      {children}
    </StyledCardContent>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };