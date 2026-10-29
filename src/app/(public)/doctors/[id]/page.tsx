import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDoctorById } from "@/features/doctors/services/doctorService";
import DoctorDetailClient from "./DoctorDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await fetchDoctorById(id);

  if (!doctor) {
    return {
      title: "Doctor Profile | ShebaMitro",
      description: "Book chamber appointment or video teleconsultation on ShebaMitro.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${doctor.name} - ${doctor.specialtyName || "Specialist"} | ShebaMitro`;
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

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params;
  const doctor = await fetchDoctorById(id);

  if (!doctor) {
    notFound();
  }

  return <DoctorDetailClient doctorId={id} initialDoctor={doctor} />;
}
