"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useProfile } from "@/contexts/ProfileContexts"; // ✅ import context

interface ProfileAvatarProps {
  size?: number;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ size = 35 }) => {
  const router = useRouter();
  const isMounted = useIsMounted(); // our hook
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profilePicture } = useProfile(); // ✅ consume context
  const [open, setOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // Prevent rendering on server to avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full border border-border hover:ring-2 hover:ring-primary transition-all"
        style={{ width: size, height: size, overflow: "hidden" }}
      >
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="Profile"
            width={size}
            height={size}
            className="object-cover rounded-full"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="rounded-full bg-surface-container"
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-popover shadow-md rounded-md border border-border animate-fadeIn">
          <button
            onClick={() => {
              router.push("/profile");
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container transition"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm hover:bg-surface-container transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;



