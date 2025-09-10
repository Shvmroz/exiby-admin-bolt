import MainLayout from '@/components/layout/MainLayout';
import EventsPageClient from '@/components/pages/EventsPageClient';

export default function EventsPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <EventsPageClient />
    </MainLayout>
  );
}