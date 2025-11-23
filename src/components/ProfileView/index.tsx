'use client';
import { Button, Marble, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col items-center gap-4 pt-6">
        <Marble src={profile.profilePictureUrl} className="w-24" />
        <h1 className="text-2xl font-semibold">@{profile.username}</h1>
      </div>

      {/* Call to action box */}
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <p className="text-lg font-medium">
          Be the first one to buy {profile.username} a coffee
        </p>
      </div>

      {/* Coffee Purchase Section */}
      <CoffeePurchase
        profile={profile}
        onSuccess={handleCoffeePurchased}
      />

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
