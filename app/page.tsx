'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const { isAuthenticated, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <Box className="min-h-screen flex items-center justify-center">
      <CircularProgress size={40} sx={{ color: '#0077ED' }} />
    </Box>
  );
}