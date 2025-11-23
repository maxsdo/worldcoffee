'use client';
import { Button, Marble, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CoffeePurchase } from './CoffeePurchase';

interface ProfileViewProps {
  username: string;
}

interface UserProfile {
  walletAddress: string;
  username: string;
  profilePictureUrl?: string;
}

interface Message {
  id: string;
  fromUsername: string;
  fromProfilePictureUrl?: string;
  message: string;
  amount: string;
  createdAt: string;
}

export const ProfileView = ({ username }: ProfileViewProps) => {
  const session = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [description, setDescription] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const [savingDescription, setSavingDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = session.data?.user?.username?.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Fetch user profile from World API
        const userInfo = await MiniKit.getUserByUsername(username);

        if (!userInfo || !userInfo.username) {
          setError('User not found');
          setLoading(false);
          return;
        }

        setProfile({
          walletAddress: userInfo.walletAddress,
          username: userInfo.username,
          profilePictureUrl: userInfo.profilePictureUrl,
        });

        // Fetch messages for this user
        const response = await fetch(`/api/messages/${username}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }

        // Fetch profile description
        const descResponse = await fetch(`/api/profile/${username}/description`);
        if (descResponse.ok) {
          const descData = await descResponse.json();
          setDescription(descData.description || '');
          setTempDescription(descData.description || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleCoffeePurchased = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleSaveDescription = async () => {
    if (!profile) return;

    try {
      setSavingDescription(true);
      const response = await fetch(`/api/profile/${profile.username}/description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: tempDescription }),
      });

      if (response.ok) {
        setDescription(tempDescription);
        setEditingDescription(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save description');
      }
    } catch (err) {
      console.error('Error saving description:', err);
      alert('Failed to save description');
    } finally {
      setSavingDescription(false);
    }
  };

  const handleCancelEdit = () => {
    setTempDescription(description);
    setEditingDescription(false);
  };

  const handleShare = async () => {
    // Create World app deep link
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    const deepLink = `https://worldcoin.org/mini-app?app_id=${appId}&path=/${profile?.username}`;

    const shareData = {
      title: `Buy @${profile?.username} a coffee`,
      text: `Support @${profile?.username} by buying them a coffee!`,
      url: deepLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(deepLink);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12">
        <p className="text-red-600">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 pt-6 w-full">
        <Marble src={profile.profilePictureUrl} className="w-24" />
        <h1 className="text-2xl font-semibold">@{profile.username}</h1>

        {/* Description Section */}
        <div className="w-full">
          {editingDescription ? (
            <div className="flex flex-col gap-2 w-full">
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value.slice(0, 240))}
                placeholder="Add a description to your profile..."
                maxLength={240}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {tempDescription.length}/240 characters
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancelEdit}
                    size="sm"
                    variant="secondary"
                    disabled={savingDescription}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveDescription}
                    size="sm"
                    variant="primary"
                    disabled={savingDescription}
                  >
                    {savingDescription ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {description ? (
                <p className="text-center text-gray-700 mb-2">{description}</p>
              ) : isOwnProfile ? (
                <p className="text-center text-gray-400 text-sm mb-2">No description yet</p>
              ) : null}
              {isOwnProfile && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setEditingDescription(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {description ? 'Edit description' : 'Add description'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share Button - Full Width */}
        <Button
          onClick={handleShare}
          size="lg"
          variant="secondary"
          className="w-full rounded-full"
        >
          Share
        </Button>
      </div>

      {/* Call to action box - show when no messages */}
      {messages.length === 0 && (
        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <p className="text-lg font-medium">
            Be the first one to buy {profile.username} a coffee
          </p>
        </div>
      )}

      {/* Coffee Purchase Section - only show if not own profile */}
      {!isOwnProfile && (
        <CoffeePurchase
          profile={profile}
          onSuccess={handleCoffeePurchased}
        />
      )}

      {/* Messages Section */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl font-semibold">Recent Supporters</h2>
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3"
            >
              <Marble src={message.fromProfilePictureUrl} className="w-10 h-10" />
              <div className="flex-1">
                <p className="font-semibold text-sm">@{message.fromUsername}</p>
                {message.message && (
                  <p className="text-gray-700 mt-1">{message.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ${message.amount} • {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
