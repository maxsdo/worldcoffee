import { Page } from '@/components/PageLayout';
import { ProfileView } from '@/components/ProfileView';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Remove @ symbol if present
  const cleanUsername = username.replace('@', '');

  if (!cleanUsername) {
    notFound();
  }

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="worldcoffee"
          startAdornment={
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <ProfileView username={cleanUsername} />
      </Page.Main>
    </>
  );
}
