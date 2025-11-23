'use client';
import { useRouter } from 'next/navigation';
import { NavArrowLeft } from 'iconoir-react';

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Go back"
    >
      <NavArrowLeft className="w-6 h-6" />
    </button>
  );
};
