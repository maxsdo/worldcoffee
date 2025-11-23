'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User } from 'iconoir-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('home');

  // Sync tab value with current pathname
  useEffect(() => {
    if (pathname.includes('/profile')) {
      setValue('profile');
    } else if (pathname.includes('/wallet')) {
      setValue('wallet');
    } else {
      setValue('home');
    }
  }, [pathname]);

  const handleTabChange = (newValue: string) => {
    setValue(newValue);

    // Navigate to the appropriate page
    switch (newValue) {
      case 'home':
        router.push('/home');
        break;
      case 'wallet':
        // TODO: Create wallet page
        router.push('/home');
        break;
      case 'profile':
        router.push('/profile');
        break;
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="wallet" icon={<Bank />} label="Wallet" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
