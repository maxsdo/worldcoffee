'use client';
import { Button, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FeaturedProfile {
  username: string;
  walletAddress: string;
  profilePictureUrl?: string;
}

export const ProfileLink = () => {
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState('');
  const [featuredProfiles, setFeaturedProfiles] = useState<FeaturedProfile[]>([]);

  useEffect(() => {
    // Fetch featured profiles from World API
    const fetchFeaturedProfiles = async () => {
      const usernames = ['telamon', 'maksim'];
      const profiles: FeaturedProfile[] = [];

      for (const username of usernames) {
        try {
          const userInfo = await MiniKit.getUserByUsername(username);
          if (userInfo && userInfo.username) {
            profiles.push({
              username: userInfo.username,
              walletAddress: userInfo.walletAddress,
              profilePictureUrl: userInfo.profilePictureUrl,
            });
          }
        } catch (error) {
          console.error(`Error fetching profile for ${username}:`, error);
        }
      }

      setFeaturedProfiles(profiles);
    };

    fetchFeaturedProfiles();
  }, []);

  const handleSearchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      const username = searchUsername.trim().replace('@', '');
      router.push(`/${username}`);
      setSearchUsername('');
    }
  };

  const handleVisitFeatured = (username: string) => {
    router.push(`/${username}`);
  };

  return (
    <div className="grid w-full gap-4">
      {/* Featured Profiles */}
      {featuredProfiles.length > 0 && (
        <>
          <p className="text-lg font-semibold">Featured</p>

          {featuredProfiles.map((profile) => (
            <button
              key={profile.username}
              onClick={() => handleVisitFeatured(profile.username)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Marble src={profile.profilePictureUrl} className="w-12" />
              <div className="flex-1 text-left">
                <p className="font-semibold">@{profile.username}</p>
                <p className="text-sm text-gray-500">Buy them a coffee</p>
              </div>
              <div className="text-2xl">☕</div>
            </button>
          ))}
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
