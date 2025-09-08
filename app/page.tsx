'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import PageSkeleton from '@/components/ui/skeleton/page-skeleton';

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
    <div className="p-6">
      <PageSkeleton type="dashboard" />
    </div>
  );
}