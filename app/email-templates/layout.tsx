'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/components/ui/spinner';

export default function EmailTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}