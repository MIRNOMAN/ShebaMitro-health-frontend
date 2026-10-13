import { MOCK_DOCTORS } from "../data/doctors";
import { Doctor, DoctorFilterState } from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
    : "http://localhost:5100/api/v1");

export const getMinFee = (doctor: Doctor): number => {
  if (!doctor.chambers || doctor.chambers.length === 0) return 1000;
  return Math.min(...doctor.chambers.map((c) => c.consultationFee));
};

export const fetchDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data as Doctor;
    }
  } catch (err) {
    console.warn("Backend fetchDoctorById failed, using fallback:", err);
  }
  const doc = MOCK_DOCTORS.find((d) => d.id === id);
  return doc || MOCK_DOCTORS[0] || null;
};

export const fetchDoctors = async (
  filters: DoctorFilterState
): Promise<{ doctors: Doctor[]; total: number }> => {
  try {
    const query = new URLSearchParams();
    if (filters.search && filters.search.trim()) {
      query.set("search", filters.search.trim());
    }
    if (filters.specialties && filters.specialties.length > 0) {
      query.set("specialty", filters.specialties.join(","));
    }
    if (filters.maxFee !== undefined && filters.maxFee < 3000) {
      query.set("maxFee", filters.maxFee.toString());
    }
    if (filters.minRating !== undefined && filters.minRating > 0) {
      query.set("ratingThreshold", filters.minRating.toString());
    }
    if (filters.gender && filters.gender !== "all") {
      query.set("gender", filters.gender);
    }
    if (filters.availableToday) {
      query.set("availableToday", "true");
    }
    query.set("limit", "50");

    const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data.items)) {
        let items: Doctor[] = data.data.items;

        // Apply client-side sorting if requested
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "rating":
              items.sort((a, b) => b.rating - a.rating);
              break;
            case "fee_asc":
              items.sort((a, b) => getMinFee(a) - getMinFee(b));
              break;
            case "fee_desc":
              items.sort((a, b) => getMinFee(b) - getMinFee(a));
              break;
            case "experience":
              items.sort((a, b) => b.experienceYears - a.experienceYears);
              break;
            case "recommended":
            default:
              items.sort(
                (a, b) =>
                  b.rating * 10 +
                  b.experienceYears -
                  (a.rating * 10 + a.experienceYears)
              );
              break;
          }
        }

        return {
          doctors: items,
          total: data.data.totalCount ?? items.length,
        };
      }
    }
  } catch (err) {
    console.warn("Backend fetchDoctors failed, using fallback:", err);
  }

  // Fallback to MOCK_DOCTORS if backend connection fails
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
        results.sort(
          (a, b) =>
            b.rating * 10 +
            b.experienceYears -
            (a.rating * 10 + a.experienceYears)
        );
        break;
    }
  }

  return {
    doctors: results,
    total: results.length,
  };
};
