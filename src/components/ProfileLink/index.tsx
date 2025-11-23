'use client';
import { Button, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FeaturedProfile {
  username: string;
  walletAddress: string;
  profilePictureUrl?: string;
}

export const ProfileLink = () => {
  const session = useSession();
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState('');
  const [featuredProfile, setFeaturedProfile] = useState<FeaturedProfile | null>(null);

  useEffect(() => {
    // Fetch @maggo.1337's profile from World API
    const fetchFeaturedProfile = async () => {
      try {
        const userInfo = await MiniKit.getUserByUsername('maggo.1337');
        if (userInfo && userInfo.username) {
          setFeaturedProfile({
            username: userInfo.username,
            walletAddress: userInfo.walletAddress,
            profilePictureUrl: userInfo.profilePictureUrl,
          });
        }
      } catch (error) {
        console.error('Error fetching featured profile:', error);
      }
    };

    fetchFeaturedProfile();
  }, []);

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

  const handleVisitFeatured = () => {
    if (featuredProfile) {
      router.push(`/${featuredProfile.username}`);
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

      {/* Featured Profile */}
      {featuredProfile && (
        <>
          <div className="w-full h-px bg-gray-200" />

          <p className="text-lg font-semibold">Featured</p>

          <button
            onClick={handleVisitFeatured}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <Marble src={featuredProfile.profilePictureUrl} className="w-12" />
            <div className="flex-1 text-left">
              <p className="font-semibold">@{featuredProfile.username}</p>
              <p className="text-sm text-gray-500">Buy them a coffee</p>
            </div>
            <div className="text-2xl">☕</div>
          </button>
        </>
      )}

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
