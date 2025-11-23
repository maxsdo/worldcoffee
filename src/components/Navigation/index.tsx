'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, User } from 'iconoir-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const router = useRouter();
  const session = useSession();
  const [value, setValue] = useState('home');

  useEffect(() => {
    if (value === 'home') {
      router.push('/home');
    } else if (value === 'profile') {
      if (session.data?.user?.username) {
        router.push(`/${session.data.user.username}`);
      }
    }
  }, [value, session.data?.user?.username, router]);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabItem value="home" icon={<Home />} label="Home" />
      {/* <TabItem value="wallet" icon={<Bank />} label="Wallet" /> */}
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
