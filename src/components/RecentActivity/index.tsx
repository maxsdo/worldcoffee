'use client';
import { useEffect, useState } from 'react';
import { Marble, CircularIcon } from '@worldcoin/mini-apps-ui-kit-react';
import { CheckCircleSolid } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { Username } from '@/components/Username';

interface Message {
  id: string;
  fromUsername: string;
  toUsername: string;
  fromProfilePictureUrl?: string;
  message: string;
  amount: string;
  createdAt: string;
  fromUserVerified?: boolean;
  toUserVerified?: boolean;
}

export const RecentActivity = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        // Fetch all messages
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          const recentMessages = data.messages || [];

          // Fetch verification status for both sender and recipient
          const messagesWithVerification = await Promise.all(
            recentMessages.map(async (msg: Message) => {
              const [fromVerifyRes, toVerifyRes] = await Promise.all([
                fetch(`/api/verify?username=${msg.fromUsername}`),
                fetch(`/api/verify?username=${msg.toUsername}`),
              ]);

              const fromVerifyData = fromVerifyRes.ok ? await fromVerifyRes.json() : { verified: false };
              const toVerifyData = toVerifyRes.ok ? await toVerifyRes.json() : { verified: false };

              return {
                ...msg,
                fromUserVerified: fromVerifyData.verified,
                toUserVerified: toVerifyData.verified,
              };
            })
          );

          setMessages(messagesWithVerification);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="w-full px-4">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600">No activity yet. Be the first to buy someone a coffee!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`/${message.toUsername}`)}
          >
            <Marble src={message.fromProfilePictureUrl} className="w-10 h-10" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <Username username={message.fromUsername} className="font-semibold text-sm" />
                {message.fromUserVerified && (
                  <CircularIcon size="xs">
                    <CheckCircleSolid className="text-blue-600" />
                  </CircularIcon>
                )}
                <span className="text-gray-600 text-sm">bought</span>
                <Username username={message.toUsername} className="font-semibold text-sm" />
                {message.toUserVerified && (
                  <CircularIcon size="xs">
                    <CheckCircleSolid className="text-blue-600" />
                  </CircularIcon>
                )}
                <span className="text-gray-600 text-sm">a coffee</span>
              </div>
              {message.message && (
                <p className="text-gray-700 text-sm mt-1 truncate">{message.message}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-600 font-medium">${message.amount}</span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
