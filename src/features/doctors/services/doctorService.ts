import { MOCK_DOCTORS } from "../data/doctors";
import { Doctor, DoctorFilterState } from "../types";

export const getMinFee = (doctor: Doctor): number => {
  if (!doctor.chambers || doctor.chambers.length === 0) return 1000;
  return Math.min(...doctor.chambers.map((c) => c.consultationFee));
};

export const fetchDoctors = async (
  filters: DoctorFilterState
): Promise<{ doctors: Doctor[]; total: number }> => {
  // Simulate network latency (250ms for realistic feel)
  await new Promise((res) => setTimeout(res, 250));

  let results = [...MOCK_DOCTORS];

  // Specialty multi-select filter
  if (filters.specialties && filters.specialties.length > 0) {
    results = results.filter((doc) =>
      filters.specialties.includes(doc.specialtyId)
    );
  }

  // Max fee filter
  if (filters.maxFee !== undefined && filters.maxFee > 0) {
    results = results.filter((doc) => getMinFee(doc) <= filters.maxFee);
  }

  // Rating filter
  if (filters.minRating !== undefined && filters.minRating > 0) {
    results = results.filter((doc) => doc.rating >= filters.minRating);
  }

  // Gender filter
  if (filters.gender && filters.gender !== "all") {
    results = results.filter((doc) => doc.gender === filters.gender);
  }

  // Available Today switch filter
  if (filters.availableToday) {
    results = results.filter((doc) => doc.availableToday === true);
  }

  // Search filter
  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (doc) =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialtyName.toLowerCase().includes(q) ||
        doc.qualifications.some((qual) => qual.toLowerCase().includes(q)) ||
        doc.hospital.toLowerCase().includes(q) ||
        doc.chambers.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q) ||
            c.area.toLowerCase().includes(q)
        )
    );
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "fee_asc":
        results.sort((a, b) => getMinFee(a) - getMinFee(b));
        break;
      case "fee_desc":
        results.sort((a, b) => getMinFee(b) - getMinFee(a));
        break;
      case "experience":
        results.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "recommended":
      default:
        results.sort((a, b) => b.rating * 10 + b.experienceYears - (a.rating * 10 + a.experienceYears));
        break;
    }
  }

  return {
    doctors: results,
    total: results.length,
  };
};
