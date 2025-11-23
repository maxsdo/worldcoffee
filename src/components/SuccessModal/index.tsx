'use client';
import { useEffect, useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Username } from '@/components/Username';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername: string;
}

export const SuccessModal = ({ isOpen, onClose, recipientUsername }: SuccessModalProps) => {
  const [coffeeFloat, setCoffeeFloat] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Animate coffee floating
      const interval = setInterval(() => {
        setCoffeeFloat(prev => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in duration-300">
        {/* Animated coffee cups */}
        <div className="flex justify-center gap-2 mb-6">
          <span className={`text-5xl transition-transform duration-500 ${coffeeFloat === 0 ? '-translate-y-2' : ''}`}>☕</span>
          <span className={`text-5xl transition-transform duration-500 ${coffeeFloat === 1 ? '-translate-y-2' : ''}`}>☕</span>
          <span className={`text-5xl transition-transform duration-500 ${coffeeFloat === 2 ? '-translate-y-2' : ''}`}>☕</span>
        </div>

        {/* Success message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Coffee sent! 🎉</h2>
          <p className="text-gray-600">
            You just made <Username username={recipientUsername} className="font-semibold text-blue-600" />'s day brighter
          </p>
        </div>

        {/* Sparkles decoration */}
        <div className="flex justify-center gap-3 text-2xl mb-6">
          <span className="animate-pulse">✨</span>
          <span className="animate-pulse delay-100">💫</span>
          <span className="animate-pulse delay-200">⭐</span>
        </div>

        {/* Close button */}
        <Button
          onClick={onClose}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
};
