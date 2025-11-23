'use client';
import { useRouter } from 'next/navigation';

interface UsernameProps {
  username: string;
  showAt?: boolean; // Whether to show @ prefix (default: true)
  className?: string; // Additional CSS classes
  onClick?: (e: React.MouseEvent) => void; // Optional custom click handler
}

export const Username = ({
  username,
  showAt = true,
  className = '',
  onClick
}: UsernameProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handlers from firing
    if (onClick) {
      onClick(e);
    } else {
      router.push(`/${username}`);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`cursor-pointer hover:underline hover:text-blue-600 transition-colors ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {showAt && '@'}{username}
    </span>
  );
};
