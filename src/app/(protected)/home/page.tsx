import { Page } from '@/components/PageLayout';
import { ProfileLink } from '@/components/ProfileLink';
import { RecentActivity } from '@/components/RecentActivity';
import { OrbuccinoLogo } from '@/components/OrbuccinoLogo';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { HomeRedirect } from '@/components/HomeRedirect';

export default async function Home() {
  return (
    <>
      <HomeRedirect />
      <Page.Header className="p-0">
        <TopBar
          title="orbuccino"
          startAdornment={<OrbuccinoLogo className="w-6 h-6" />}
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-6 mb-16">
        <ProfileLink />
        <RecentActivity />
      </Page.Main>
    </>
  );
}
