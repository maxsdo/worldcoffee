import { Page } from '@/components/PageLayout';
import { ProfileLink } from '@/components/ProfileLink';
import { RecentActivity } from '@/components/RecentActivity';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { HomeRedirect } from '@/components/HomeRedirect';

export default async function Home() {
  return (
    <>
      <HomeRedirect />
      <Page.Header className="p-0">
        <TopBar
          title="worldcoffee"
          startAdornment={
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-6 mb-16">
        <ProfileLink />
        <RecentActivity />
      </Page.Main>
    </>
  );
}
