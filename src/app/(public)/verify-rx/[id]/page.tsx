import type { Metadata } from "next";
import PublicRxVerificationClient from "./PublicRxVerificationClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Cryptographic Prescription Verification | ShebaMitro",
    description: "Verify digital e-prescription cryptographic validity on ShebaMitro Healthcare.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/verify-rx/${id}`,
    },
  };
}

export default function PublicRxVerificationPage() {
  return <PublicRxVerificationClient />;
}
