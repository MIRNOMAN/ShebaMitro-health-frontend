import type { Metadata } from "next";
import PharmacyPageClient from "./PharmacyPageClient";

export const metadata: Metadata = {
  title: "Online Pharmacy & Express 2-Hour Medicine Delivery | ShebaMitro",
  description:
    "Order 100% genuine prescription medicines, OTC remedies, diabetic essentials, and wellness products with express 2-hour doorstep delivery across Bangladesh.",
  alternates: {
    canonical: "/pharmacy",
  },
  openGraph: {
    title: "Online Pharmacy & Express 2-Hour Medicine Delivery | ShebaMitro",
    description:
      "Order 100% genuine prescription medicines and wellness products with express 2-hour doorstep delivery in Bangladesh.",
    url: "/pharmacy",
  },
};

export default function PharmacyPage() {
  return <PharmacyPageClient />;
}
