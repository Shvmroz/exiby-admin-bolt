import MainLayout from '@/components/layout/MainLayout';
import StripeConfigurationPageClient from '@/components/pages/StripeConfigurationPageClient';

export default function StripeConfigurationPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="form">
      <StripeConfigurationPageClient />
    </MainLayout>
  );
}