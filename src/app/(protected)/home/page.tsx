import { Page } from '@/components/PageLayout';
import { ProfileLink } from '@/components/ProfileLink';
import { RecentActivity } from '@/components/RecentActivity';
import { OrbuccinoHeader } from '@/components/OrbuccinoHeader';
import { HomeRedirect } from '@/components/HomeRedirect';

export default async function Home() {
  return (
    <>
      <HomeRedirect />
      <Page.Header className="p-0">
        <OrbuccinoHeader />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-6 mb-16">
        <ProfileLink />
        <RecentActivity />
      </Page.Main>
    </>
  );
}
