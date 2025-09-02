'use client';

import React from 'react';
import { Tabs as MuiTabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#0077ED',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '14px',
    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
    '&.Mui-selected': {
      color: '#0077ED',
    },
  },
}));

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
}>({
  value: '',
  setValue: () => {},
});

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  const { value, setValue } = React.useContext(TabsContext);
  
  // Extract tab values from children
  const tabValues: string[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props.value) {
      tabValues.push(child.props.value);
    }
  });

  return (
    <StyledTabs
      value={value}
      onChange={(_, newValue) => setValue(newValue)}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <Tab
              label={child.props.children}
              value={child.props.value}
            />
          );
        }
        return child;
      })}
    </StyledTabs>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  return null; // This is handled by TabsList
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const { value: currentValue } = React.useContext(TabsContext);
  
  if (currentValue !== value) {
    return null;
  }

  return (
    <Box className={className} sx={{ mt: 2 }}>
      {children}
    </Box>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };