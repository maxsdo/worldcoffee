'use client';
import { walletAuth } from '@/auth/wallet';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useState } from 'react';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isInstalled } = useMiniKit();

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }

    setIsPending(true);
    setAuthError(null);

    try {
      await walletAuth();
    } catch (error) {
      console.error('Wallet authentication button error', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  // Remove automatic authentication to prevent infinite loops
  // Users should explicitly click the button to authenticate

  return (
    <div className="w-full space-y-2">
      <LiveFeedback
        label={{
          failed: 'Failed to login',
          pending: 'Logging in',
          success: 'Logged in',
        }}
        state={authError ? 'failed' : isPending ? 'pending' : undefined}
      >
        <Button
          onClick={onClick}
          disabled={isPending || !isInstalled}
          size="lg"
          variant="primary"
          className="w-full"
        >
          {!isInstalled ? 'MiniKit not available' : 'Login with Wallet'}
        </Button>
      </LiveFeedback>
      {authError && (
        <p className="text-sm text-red-500 text-center">{authError}</p>
      )}
    </div>
  );
};
