'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  walletAddress: string;
  username: string;
  profilePictureUrl?: string;
}

interface CoffeePurchaseProps {
  profile: UserProfile;
  onSuccess: (message: any) => void;
}

export const CoffeePurchase = ({ profile, onSuccess }: CoffeePurchaseProps) => {
  const [message, setMessage] = useState('');
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const session = useSession();

  const handleBuyCoffee = async () => {
    if (!session.data?.user) {
      alert('Please sign in to buy coffee');
      return;
    }

    try {
      setButtonState('pending');

      // Generate payment reference ID
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUsername: profile.username,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { id } = await res.json();

      // Initiate payment through MiniKit
      const result = await MiniKit.commandsAsync.pay({
        reference: id,
        to: profile.walletAddress,
        tokens: [
          {
            symbol: Tokens.USDC,
            token_amount: tokenToDecimals(4.99, Tokens.USDC).toString(),
          },
        ],
        description: `Coffee for @${profile.username}`,
      });

      if (result.finalPayload.status === 'success') {
        // Save the message
        const saveRes = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: id,
            toUsername: profile.username,
            message: message.trim(),
            amount: '4.99',
            transactionHash: result.finalPayload.transaction_id,
          }),
        });

        if (saveRes.ok) {
          const savedMessage = await saveRes.json();
          onSuccess(savedMessage);
          setMessage('');
          setButtonState('success');

          setTimeout(() => {
            setButtonState(undefined);
          }, 3000);
        } else {
          throw new Error('Failed to save message');
        }
      } else {
        setButtonState('failed');
        setTimeout(() => {
          setButtonState(undefined);
        }, 3000);
      }
    } catch (error) {
      console.error('Error buying coffee:', error);
      setButtonState('failed');
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4">
      {/* Coffee item */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
          ☕
        </div>
        <div className="flex-1">
          <p className="font-semibold">1x coffee</p>
          <input
            type="text"
            placeholder="Add a public message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            className="w-full text-sm text-gray-500 mt-1 outline-none placeholder-gray-400"
            disabled={buttonState === 'pending'}
          />
        </div>
        <p className="font-semibold">$4.99</p>
      </div>

      {/* Buy button */}
      <LiveFeedback
        label={{
          failed: 'Payment failed',
          pending: 'Processing payment...',
          success: 'Coffee purchased!',
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={handleBuyCoffee}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Buy {profile.username} a coffee
        </Button>
      </LiveFeedback>
    </div>
  );
};
