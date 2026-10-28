import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "My Health Account & Profile | ShebaMitro",
  description: "Manage your personal healthcare profile, family members, and medical credentials on ShebaMitro.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
