import { Page } from '@/components/PageLayout';
import { ProfileView } from '@/components/ProfileView';
import { BackButton } from '@/components/BackButton';
import { OrbuccinoLogo } from '@/components/OrbuccinoLogo';
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
          title="orbuccino"
          startAdornment={
            <>
              <BackButton />
              <OrbuccinoLogo className="w-6 h-6 ml-4" />
            </>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <ProfileView username={cleanUsername} />
      </Page.Main>
    </>
  );
}
