import MainLayout from '@/components/layout/MainLayout';
import PaymentPlansPageClient from '@/components/pages/PaymentPlansPageClient';

export default function PaymentPlansPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <PaymentPlansPageClient />
    </MainLayout>
  );
}