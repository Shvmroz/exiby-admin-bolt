'use client';

import React from 'react';
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
}));

const StyledTableCell = styled(MuiTableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
  padding: '16px',
}));

const StyledTableHead = styled(MuiTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f9fafb',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#4b5563' : '#e5e7eb'}`,
  fontWeight: 500,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
  padding: '12px 16px',
}));

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  colSpan?: number;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <StyledTableContainer component={Paper} elevation={0}>
      <MuiTable>
        {children}
      </MuiTable>
    </StyledTableContainer>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <MuiTableHead>{children}</MuiTableHead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <MuiTableBody>{children}</MuiTableBody>;
};

const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <MuiTableRow 
      onClick={onClick}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#374151' : '#f9fafb',
        } : {},
      }}
    >
      {children}
    </MuiTableRow>
  );
};

const TableHead: React.FC<TableHeadProps> = ({ children, className }) => {
  return <StyledTableHead>{children}</StyledTableHead>;
};

const TableCell: React.FC<TableCellProps> = ({ children, className, onClick, colSpan }) => {
  return (
    <StyledTableCell onClick={onClick} colSpan={colSpan}>
      {children}
    </StyledTableCell>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};