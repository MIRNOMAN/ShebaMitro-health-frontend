import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_DOCTORS } from "@/features/doctors/data/doctors";
import DoctorDetailClient from "./DoctorDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = MOCK_DOCTORS.find((d) => d.id === id);

  if (!doctor) {
    return {
      title: "Doctor Profile Not Found | ShebaMitro",
      description: "The requested doctor profile is not available on ShebaMitro.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${doctor.name} - ${doctor.specialtyName} | ShebaMitro`;
  const description = `Book chamber appointment or video teleconsultation with ${doctor.name}, ${doctor.designation} at ${doctor.hospital}. BMDC Verified: ${doctor.bmdcNo}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/doctors/${doctor.id}`,
    },
    openGraph: {
      title,
      description,
      url: `/doctors/${doctor.id}`,
      type: "profile",
      images: [
        {
          url: doctor.avatarUrl,
          alt: doctor.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [doctor.avatarUrl],
    },
  };
}

export async function generateStaticParams() {
  return MOCK_DOCTORS.map((doc) => ({ id: doc.id }));
}

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params;
  const doctor = MOCK_DOCTORS.find((d) => d.id === id);

  if (!doctor) {
    notFound();
  }

  return <DoctorDetailClient doctorId={id} />;
}
