import MainLayout from '@/components/layout/MainLayout';
import SettingsPageClient from '@/components/pages/SettingsPageClient';

export default function SettingsPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="settings">
      <SettingsPageClient />
    </MainLayout>
  );
}