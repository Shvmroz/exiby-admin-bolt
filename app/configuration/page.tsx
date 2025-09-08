import MainLayout from '@/components/layout/MainLayout';
import ConfigurationPageClient from '@/components/pages/ConfigurationPageClient';

export default function ConfigurationPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="form">
      <ConfigurationPageClient />
    </MainLayout>
  );
}