'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ProfileLink = () => {
  const session = useSession();
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState('');

  const handleViewProfile = () => {
    if (session?.data?.user?.username) {
      router.push(`/${session.data.user.username}`);
    }
  };

  const handleSearchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      const username = searchUsername.trim().replace('@', '');
      router.push(`/${username}`);
      setSearchUsername('');
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Your Profile</p>

      <Button
        onClick={handleViewProfile}
        size="lg"
        variant="secondary"
        className="w-full"
      >
        View My Coffee Page
      </Button>

      <div className="w-full h-px bg-gray-200" />

      <p className="text-lg font-semibold">Find Someone</p>

      <form onSubmit={handleSearchProfile} className="flex gap-2">
        <input
          type="text"
          placeholder="@username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
        />
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={!searchUsername.trim()}
        >
          Visit
        </Button>
      </form>
    </div>
  );
};
