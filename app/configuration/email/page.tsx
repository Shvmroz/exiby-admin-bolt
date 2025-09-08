import MainLayout from '@/components/layout/MainLayout';
import EmailConfigurationPageClient from '@/components/pages/EmailConfigurationPageClient';

export default function EmailConfigurationPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="form">
      <EmailConfigurationPageClient />
    </MainLayout>
  );
}