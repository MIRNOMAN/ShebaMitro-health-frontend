import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { HomePageClient } from "./components/HomePageClient";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Digital Health & Medicine Portal`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} - Digital Health & Medicine Portal`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Digital Healthcare Platform`,
      },
    ],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
