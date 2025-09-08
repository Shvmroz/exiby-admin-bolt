import MainLayout from '@/components/layout/MainLayout';
import CompaniesPageClient from '@/components/pages/CompaniesPageClient';

export default function CompaniesPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <CompaniesPageClient />
    </MainLayout>
  );
}