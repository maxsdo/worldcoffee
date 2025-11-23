'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const HomeRedirect = () => {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only redirect if coming from login (has callbackUrl in searchParams)
    // This prevents redirect loop when user explicitly navigates to /home
    const isFromLogin = searchParams.get('callbackUrl') !== null;

    if (session.data?.user?.username && isFromLogin) {
      router.replace(`/${session.data.user.username}`);
    }
  }, [session.data?.user?.username, router, searchParams]);

  return null;
};
