"use client";

import { useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [shareLoading, setShareLoading] = useState(false);

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const username = session?.user?.username || session?.user?.walletAddress;
      const baseUrl = window.location.origin;

      // Create a shareable link to this user's profile in the mini app
      const profileUrl = `${baseUrl}/profile`;
      const shareTitle = "Check out my World Coffee profile!";
      const shareText = `Visit @${username}'s profile on World Coffee`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled share or error occurred
      console.error("Share failed:", error);
    } finally {
      setShareLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const username = session.user?.username || "user";
  const profilePicture = session.user?.profilePictureUrl;

  return (
    <div className="flex flex-col h-full bg-gray-50 px-6 pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
          <h1 className="text-xl font-medium">worldcoffee</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={username}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <span className="text-base font-medium">{username}</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center">
        {/* Large Profile Picture */}
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-6 overflow-hidden">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>

        {/* Username */}
        <h2 className="text-2xl font-semibold mb-8">@{username}</h2>

        {/* Empty State Message */}
        <div className="w-full max-w-md bg-gray-200 rounded-3xl p-12 text-center mb-auto">
          <p className="text-lg leading-relaxed">
            We&apos;ll notify you when you get your first coffee on world!
          </p>
        </div>

        {/* Share Button */}
        <div className="w-full max-w-md mt-8">
          <Button
            onClick={handleShare}
            disabled={shareLoading}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-4 px-6 rounded-full text-lg"
          >
            {shareLoading ? "Sharing..." : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );
}
