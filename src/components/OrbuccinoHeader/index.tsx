'use client';
import { useRouter } from 'next/navigation';
import { OrbuccinoLogo } from '@/components/OrbuccinoLogo';

interface OrbuccinoHeaderProps {
  showBackButton?: boolean;
}

export const OrbuccinoHeader = ({ showBackButton }: OrbuccinoHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full h-14 border-b border-gray-200 bg-white relative">
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-2">
        <OrbuccinoLogo className="w-7 h-7" />
        <h1 className="text-lg font-semibold">orbuccino</h1>
      </div>
    </div>
  );
};
