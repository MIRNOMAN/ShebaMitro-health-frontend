export const siteConfig = {
  name: "ShebaMitro Healthcare",
  shortName: "ShebaMitro",
  description:
    "Integrated Bangladeshi Healthcare Platform for Specialist Doctor Appointments, Medicine Alarms, Diagnostic Packages, and Express Pharmacy Delivery.",
  url: "https://shebamitro.web.mirnoman.com",
  ogImage: "https://shebamitro.web.mirnoman.com/images/hero-doctor.jpg",
  creator: "ShebaMitro Health Ltd.",
  authors: [
    {
      name: "ShebaMitro Health Ltd.",
      url: "https://shebamitro.web.mirnoman.com",
    },
  ] as {
    name: string;
    url: string;
  }[],
  keywords: [
    "ShebaMitro",
    "Healthcare Bangladesh",
    "Specialist Doctor Appointments",
    "BMDC Doctors",
    "Telemedicine Bangladesh",
    "Online Pharmacy",
    "Express Medicine Delivery",
    "Diagnostic Lab Packages",
    "Home Blood Sample Collection",
    "Smart Medicine Alarms",
    "Digital Health Records",
    "E-Prescription Verification",
  ] as string[],
  links: {
    twitter: "https://twitter.com/shebamitro",
    facebook: "https://facebook.com/shebamitro",
    linkedin: "https://linkedin.com/company/shebamitro",
  },
} as const;

export type SiteConfig = typeof siteConfig;
