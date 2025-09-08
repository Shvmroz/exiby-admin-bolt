import MainLayout from '@/components/layout/MainLayout';
import AnalyticsPageClient from '@/components/pages/AnalyticsPageClient';

export default function AnalyticsPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="analytics">
      <AnalyticsPageClient />
    </MainLayout>
  );
}