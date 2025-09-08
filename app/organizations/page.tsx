import MainLayout from '@/components/layout/MainLayout';
import OrganizationsPageClient from '@/components/pages/OrganizationsPageClient';

export default function OrganizationsPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <OrganizationsPageClient />
    </MainLayout>
  );
}