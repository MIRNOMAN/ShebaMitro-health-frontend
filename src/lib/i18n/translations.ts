export type Locale = "bn" | "en" | "hi";

export interface LanguageOption {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: "bn", label: "Bangla", nativeLabel: "বাংলা", flag: "🇧🇩" },
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", flag: "🇮🇳" },
];

export const translations = {
  en: {
    // Header & Navbar
    brandTagline: "Healthcare Ecosystem",
    findDoctors: "Find Doctors",
    diagnostics: "Diagnostics",
    pharmacy: "Pharmacy",
    healthPackages: "Health Packages",
    emergencySos: "SOS 24/7",
    emergencySosFull: "Emergency SOS Dispatch 24/7",
    logIn: "Log In",
    signUp: "Sign Up",
    selectRole: "Select Portal Role",

    // Omni Search
    searchPlaceholder: "Search by Doctor, Symptom e.g. Chest Pain, or Diagnostic Test...",
    searchButton: "Search",
    trendingSearches: "Trending Medical Searches",
    noResultsFound: "No medical services found",
    noResultsSub: "Try searching for 'Cardiologist', 'Chest Pain', or 'MRI Scan'.",

    // Hero Section
    heroBadge: "ShebaMitro • Smart Digital Healthcare",
    heroTitleLine1: "Simple & Reliable",
    heroTitleLine2: "Digital Healthcare",
    heroTitleLine3: "Right At Your Fingertips.",
    heroSubtitle: "BMDC certified doctor video consultations, 2-hour pharmacy delivery, and home lab tests.",
    bmdcVerifiedBadge: "BMDC Certified",
    telemedActiveBadge: "24/7 Tele-Care",
    expressDeliveryBadge: "2-Hour Delivery",

    // Hero Slider
    slide1Badge: "BMDC Certified Doctors",
    slide1Title: "Specialist Doctor Consultations",
    slide1Sub: "1,200+ Experienced BMDC Registered Specialists",

    slide2Badge: "Family Health Shield",
    slide2Title: "Complete Family Healthcare",
    slide2Sub: "All-in-one medical care from the comfort of home",

    slide3Badge: "24/7 Instant Video Call",
    slide3Title: "Instant Telemedicine Service",
    slide3Sub: "Connect with certified doctors within 60 seconds",

    slide4Badge: "2-Hour Express Delivery",
    slide4Title: "100% Genuine Medicine",
    slide4Sub: "Cold-chain express delivery from model pharmacies",

    // Bento Grid
    bentoHeaderBadge: "ShebaMitro Health Ecosystem",
    bentoHeaderTitle: "Modern Digital Healthcare",
    bentoHeaderTitleHighlight: "Solutions Built For You",
    bentoHeaderSubtitle: "From smart medicine alarms to 2-hour express delivery — complete health protection for your family.",
    
    alarmBadge: "AI Medicine Reminder",
    alarmTitle: "Smart Medicine Alarms & Dose Tracker",
    alarmDesc: "Never miss a dose. Automated push notifications, WhatsApp alerts, and audio reminders.",
    alarmBtn: "Add Medication Schedule",

    telemedBadge: "BMDC Registered Doctors",
    telemedTitle: "24/7 Live HD Video Consultations",
    telemedDesc: "Connect with verified specialist doctors within 60 seconds and get instant e-prescriptions.",
    telemedBtn: "Consult Doctor Now",

    pharmacyCardBadge: "100% Genuine Medicine",
    pharmacyTitle: "2-Hour Express Pharmacy Delivery",
    pharmacyDesc: "Temperature-controlled cold-chain delivery directly from certified model pharmacies.",
    pharmacyBtn: "Order Prescription Medicine",

    labCardBadge: "ISO 15189 Accredited",
    labTitle: "Home Lab Sample Collection",
    labDesc: "Certified phlebotomist collects blood samples at your doorstep with digital reports in <12 hours.",
    labBtn: "Book Home Lab Test",

    // Specialty Carousel
    specialtyCategory: "Comprehensive Medical Care",
    specialtyTitle: "Browse Medical Specialties",

    // Stats Counter
    liveActivity: "Live Activity:",
    liveActivityFeed: "Dr. Farah Ahmed completed a live video consultation in Dhaka • 14s ago",
    statConsultations: "Completed Consultations",
    statConsultationsSub: "Across 64 districts in Bangladesh",
    statDoctors: "BMDC Certified Specialists",
    statDoctorsSub: "Verified credentials & BMDC IDs",
    statDelivery: "On-Time Express Delivery",
    statDeliverySub: "Average delivery time 42 mins",
    statRating: "Patient Satisfaction Rating",
    statRatingSub: "Based on 14,000+ verified reviews",

    // Mega Menu Descriptions & Services
    findDoctorsDesc: "Connect with verified specialists & online consultations",
    specialistSearch: "Specialist Search",
    specialistSearchDesc: "Browse 50+ medical specialties & book in-person visits",
    telemedicine: "Telemedicine Video Consult",
    telemedicineDesc: "Instant HD video consultations with top physicians 24/7",
    emergencySpecialists: "Emergency Specialists",
    emergencySpecialistsDesc: "Urgent care & ICU specialists available for immediate dispatch",

    diagnosticsDesc: "Book accredited lab tests & home sample collection",
    homeCollection: "Home Lab Sample Collection",
    homeCollectionDesc: "Certified phlebotomists collect samples at your doorstep",
    imagingCenters: "Diagnostic Imaging Centers",
    imagingCentersDesc: "Book MRI, CT Scans, X-Rays, & Ultrasound appointments",
    reportVault: "E-Report Vault",
    reportVaultDesc: "Secure digital lab test reports delivered in <24 hours",

    pharmacyMenuDesc: "Order genuine medicines & healthcare products online",
    uploadPrescription: "Upload Prescription",
    uploadPrescriptionDesc: "Instant AI prescription parsing & pharmacist validation",
    rapidExpress: "Rapid Medicine Express",
    rapidExpressDesc: "Guaranteed 2-hour home delivery for critical medications",
    chronicSubscriptions: "Chronic Care Subscriptions",
    chronicSubscriptionsDesc: "Automatic monthly refill orders with 15% discount",

    packagesDesc: "Comprehensive health checkups for individuals & families",
    fullBodyCheckup: "Full Body Checkups",
    fullBodyCheckupDesc: "80+ vital health parameters tested in a single package",
    diabetesShield: "Diabetes Care Shield",
    diabetesShieldDesc: "HbA1c, lipid profile, kidney & eye screening bundle",
    seniorWellness: "Senior Citizen Wellness",
    seniorWellnessDesc: "Comprehensive cardiac, bone density, & organ screening",

    // Role Login Modal
    multiRoleTitle: "Multi-Role Access Control",
    selectAccountRole: "Select Portal Account Role",
    chooseRoleDesc: "Choose your designated role to log in or register your account.",
    rolePatientTitle: "Patient / General User",
    patientBadge: "Patient Portal",
    patientRoleDesc: "Book doctor appointments, view lab reports, & order medicines.",
    patientRole: "Patient Portal",

    roleDoctorTitle: "Licensed Doctor",
    doctorBadge: "Doctor Portal",
    doctorRoleDesc: "Manage consultations, e-prescriptions, & patient health history.",
    doctorRole: "Doctor Portal",

    roleLabTitle: "Diagnostic Lab",
    labBadge: "Lab Portal",
    labRoleDesc: "Upload diagnostic test reports & process home sample collection.",
    labRole: "Lab Portal",

    rolePharmacyTitle: "Pharmacy Partner",
    pharmacyBadge: "Pharmacy Portal",
    pharmacyRoleDesc: "Fulfill digital e-prescriptions & manage medicine dispatches.",
    pharmacyRole: "Pharmacy Portal",

    loginAs: "Log In as",
    registerNewAccount: "Register New Account",

    // Emergency SOS Modal
    emergencySosDispatch: "EMERGENCY SOS DISPATCH",
    sosSubtitle: "24/7 Rapid Ambulance & Medical Emergency Unit",
    gpsStatus: "GPS Location Status",
    locatingGps: "Locating...",
    gpsLocked: "GPS Locked",
    demoLocation: "Demo Location",
    latitude: "Latitude",
    longitude: "Longitude",
    estimatedArrival: "Estimated Arrival:",
    minsArrival: "6 - 10 Mins",
    refreshGps: "Refresh GPS",
    ambulanceDispatched: "Ambulance Dispatched!",
    ambulanceEnRoute: "Emergency Medical Unit #409 is en route to your GPS coordinates. Medical dispatch will call you immediately.",
    dispatchAmbulanceNow: "Dispatch Emergency Ambulance Now",
    transmittingGps: "Transmitting GPS to Dispatch...",
    callNationalHotline: "Call National Hotline (999)",

    // Footer
    footerPartnerHeader: "Accredited Healthcare Partners & BMDC Trust Badges",
    footerVerifiedNetwork: "Verified Network • 100% Certified",
    footerCompanyDesc: "Bangladesh's premier connected healthcare ecosystem uniting Patients, Doctors, Diagnostic Labs, and Pharmacies into a single seamless, high-speed digital platform.",
    footerPortalsHeader: "Healthcare Portals",
    footerEmergencyHeader: "Emergency & Hotlines",
    footerNationalHotlineLabel: "National Hotline",
    footerNationalHotlineSub: "Call 999 Ambulance",
    footerTelemedHotlineLabel: "24/7 Telemedicine Hotline",
    footerTelemedHotlineSub: "Instant Doctor Consultations",
    footerSubscribeHeader: "Health Insights & Updates",
    footerSubscribeDesc: "Subscribe to receive weekly medical tips, wellness reports, and instant emergency alerts.",
    enterEmailPlaceholder: "Enter your email address...",
    subscribingButton: "Subscribing...",
    subscribeButton: "Subscribe to Health Updates",
    subscribeSuccessMessage: "Thank you for subscribing! Check your email for health updates.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    securityHipaa: "Security & HIPAA",

    // Theme & Lang
    themeLight: "Light",
    themeDark: "Dark",
    themeAuto: "System Auto",
    selectLanguage: "Select Language",
  },
  bn: {
    // Header & Navbar
    brandTagline: "স্বাস্থ্যসেবা ইকোসিস্টেম",
    findDoctors: "ডাক্তার খুঁজুন",
    diagnostics: "ডায়াগনস্টিকস",
    pharmacy: "ফার্মেসি",
    healthPackages: "হেলথ প্যাকেজ",
    emergencySos: "জরুরি সেবা ২৪/৭",
    emergencySosFull: "২৪/৭ জরুরি অ্যাম্বুলেন্স ডিসপ্যাচ",
    logIn: "লগইন করুন",
    signUp: "সাইন আপ",
    selectRole: "পোর্টাল রোল নির্বাচন করুন",

    // Omni Search
    searchPlaceholder: "ডাক্তার, উপসর্গ (যেমন: বুক ব্যথা), বা ল্যাব টেস্ট অনুসন্ধান করুন...",
    searchButton: "খুঁজুন",
    trendingSearches: "জনপ্রিয় ট্রেন্ডিং সার্চ",
    noResultsFound: "কোনো সেবা পাওয়া যায়নি",
    noResultsSub: "'কার্ডিওলজিস্ট', 'বুক ব্যথা', বা 'এমআরআই স্ক্যান' লিখে চেষ্টা করুন।",

    // Hero Section
    heroBadge: "সেবামিত্র • স্মার্ট ডিজিটাল স্বাস্থ্যসেবা",
    heroTitleLine1: "সহজ ও নির্ভরযোগ্য",
    heroTitleLine2: "ডিজিটাল স্বাস্থ্যসেবা",
    heroTitleLine3: "আপনার হাতের মুঠোয়।",
    heroSubtitle: "বিএমডিসি রেজিস্টার্ড ডাক্তারদের ভিডিও পরামর্শ, ২ ঘণ্টার মধ্যে ওষুধ ডেলিভারি ও হোম ল্যাব টেস্ট।",
    bmdcVerifiedBadge: "বিএমডিসি রেজিস্টার্ড",
    telemedActiveBadge: "২৪/৭ ভিডিও কল",
    expressDeliveryBadge: "২ ঘণ্টা ডেলিভারি",

    // Hero Slider
    slide1Badge: "বিএমডিসি রেজিস্টার্ড ডাক্তার",
    slide1Title: "বিশেষজ্ঞ চিকিৎসকের পরামর্শ",
    slide1Sub: "১,২০০+ অভিজ্ঞ বিএমডিসি নিবন্ধিত ডাক্তার",

    slide2Badge: "পারিবারিক স্বাস্থ্য সুরক্ষা",
    slide2Title: "সম্পূর্ণ পরিবারের স্বাস্থ্যসেবা",
    slide2Sub: "সহজে ঘরে বসেই সব ধরনের সেবা নিন",

    slide3Badge: "২৪/৭ লাইভ ভিডিও কল",
    slide3Title: "তাত্ক্ষণিক টেলিমেডিসিন সেবা",
    slide3Sub: "৬০ সেকেন্ডের মধ্যে ডাক্তারের সাথে যুক্ত হন",

    slide4Badge: "২ ঘণ্টায় দ্রুত ডেলিভারি",
    slide4Title: "১ ১০০% আসল ওষুধ সরবরাহ",
    slide4Sub: "মডেল ফার্মেসি থেকে সরাসরি হোম ডেলিভারি",

    // Bento Grid
    bentoHeaderBadge: "সেবামিত্র হেলথ ইকোসিস্টেম",
    bentoHeaderTitle: "ডিজিটাল স্বাস্থ্যসেবার",
    bentoHeaderTitleHighlight: "আধুনিক সমাধান",
    bentoHeaderSubtitle: "স্মার্ট মেডিসিন রিমাইন্ডার থেকে শুরু করে ২ ঘণ্টার এক্সপ্রেস ওষুধ ডেলিভারি — আপনার পরিবারের সকল স্বাস্থ্য সেবায় সেবামিত্র।",

    alarmBadge: "এআই মেডিসিন রিমাইন্ডার",
    alarmTitle: "স্মার্ট মেডিসিন অ্যালার্ম ও ডোজ ট্র্যাকার",
    alarmDesc: "সময়মতো ওষুধ খেতে কখনো ভুলবেন না। অটোমেটেড পুশ নোটিফিকেশন, হোয়াটসঅ্যাপ অ্যালার্ট এবং ভয়েস রিমাইন্ডার সুবিধা।",
    alarmBtn: "ওষুধের সময়সূচী যোগ করুন",

    telemedBadge: "বিএমডিসি রেজিস্টার্ড ডাক্তার",
    telemedTitle: "২৪/৭ লাইভ এইচডি ভিডিও টেলিকন্সালটেশন",
    telemedDesc: "মাত্র ৬০ সেকেন্ডের মধ্যে অভিজ্ঞ ডাক্তারের সাথে সরাসরি ভিডিও কলে কথা বলুন এবং সাথে সাথে ডিজিটাল প্রেসক্রিপশন গ্রহণ করুন।",
    telemedBtn: "ডাক্তারের সাথে কথা বলুন",

    pharmacyCardBadge: "১০০% আসল ওষুধ",
    pharmacyTitle: "২ ঘণ্টায় এক্সপ্রেস ফার্মেসি ডেলিভারি",
    pharmacyDesc: "তাপমাত্রা-নিয়ন্ত্রিত কোল্ড চেইন বক্সে সরাসরি মডেল ফার্মেসি থেকে শতভাগ আসল প্রেসক্রিপশন ওষুধ পৌঁছে দেওয়া হয়।",
    pharmacyBtn: "প্রেসক্রিপশন আপলোড করে ওষুধ অর্ডার করুন",

    labCardBadge: "ISO 15189 অ্যাক্রেডিটেড",
    labTitle: "হোম ল্যাব স্যাম্পল কালেকশন",
    labDesc: "দক্ষ ও সার্টিফাইড টেকনিশিয়ান আপনার বাসায় গিয়ে রক্তের নমুনা সংগ্রহ করবেন। ১২ ঘণ্টার মধ্যে ডিজিটাল স্মার্ট রিপোর্ট।",
    labBtn: "হোম ল্যাব টেস্ট বুক করুন",

    // Specialty Carousel
    specialtyCategory: "বিশেষজ্ঞ চিকিৎসা ক্যাটাগরি",
    specialtyTitle: "সকল মেডিকেল স্পেশালিটি",

    // Stats Counter
    liveActivity: "লাইভ অ্যাক্টিভিটি:",
    liveActivityFeed: "ডাঃ ফারাহ আহমেদ ঢাকা থেকে লাইভ ভিডিও কনসালটেশন সম্পন্ন করেছেন • ১৪ সে পূর্বে",
    statConsultations: "সফল চিকিৎসা সেবা",
    statConsultationsSub: "বাংলাদেশের ৬৪টি জেলায় বিস্তৃত",
    statDoctors: "বিএমডিসি নিবন্ধিত ডাক্তার",
    statDoctorsSub: "যাচাইকৃত রেজিস্টার্ড বিশেষজ্ঞ প্যানেল",
    statDelivery: "দ্রুত ওষুধ সরবরাহ",
    statDeliverySub: "গড় ডেলিভারি সময় মাত্র ৪২ মিনিট",
    statRating: "রোগীদের সন্তুষ্টি রেটিং",
    statRatingSub: "১৪,০০০+ পেশেন্ট রিভিউ এর ভিত্তিতে",

    // Mega Menu Descriptions & Services
    findDoctorsDesc: "যাচাইকৃত বিশেষজ্ঞ ডাক্তার ও অনলাইন পরামর্শ নিন",
    specialistSearch: "বিশেষজ্ঞ ডাক্তার অনুসন্ধান",
    specialistSearchDesc: "৫০+ মেডিকেল স্পেশালিটির ডাক্তার খুঁজুন ও অ্যাপয়েন্টমেন্ট নিন",
    telemedicine: "অনলাইন ভিডিও কনসালটেশন",
    telemedicineDesc: "২৪/৭ বিশেষজ্ঞ ডাক্তারের সাথে লাইভ ভিডিও পরামর্শ নিন",
    emergencySpecialists: "জরুরি বিশেষজ্ঞ সেবা",
    emergencySpecialistsDesc: "জরুরি আইসিইউ ও স্পেশালিস্ট ডাক্তার তাতক্ষণিক সেবা",

    diagnosticsDesc: "অ্যাক্রেডিটেড ল্যাব টেস্ট ও হোম স্যাম্পল কালেকশন",
    homeCollection: "বাসায় ল্যাব টেস্ট স্যাম্পল কালেকশন",
    homeCollectionDesc: "দক্ষ টেকনিশিয়ান আপনার বাসায় এসে নমুনা সংগ্রহ করবেন",
    imagingCenters: "ডায়াগনস্টিক ইমেজিং সেন্টার (MRI/CT)",
    imagingCentersDesc: "এমআরআই, সিটি স্ক্যান, এক্স-রে ও আল্ট্রাসাউন্ড অ্যাপয়েন্টমেন্ট",
    reportVault: "ডিজিটাল ল্যাব রিপোর্ট ভল্ট",
    reportVaultDesc: "২৪ ঘণ্টার মধ্যে ডিজিটাল ল্যাব রিপোর্ট অনলাইনে পান",

    pharmacyMenuDesc: "অনলাইনে আসল ওষুধ ও হেলথকেয়ার পণ্য অর্ডার করুন",
    uploadPrescription: "প্রেসক্রিপশন আপলোড করুন",
    uploadPrescriptionDesc: "এআই প্রেসক্রিপশন স্ক্যান ও ফার্মাসিস্ট ভ্যালিডেশন",
    rapidExpress: "২ ঘণ্টায় এক্সপ্রেস ডেলিভারি",
    rapidExpressDesc: "জরুরি ওষুধ মাত্র ২ ঘণ্টায় আপনার দরজায় পৌঁছে যাবে",
    chronicSubscriptions: "মাসিক রিফিল সাবস্ক্রিপশন (১৫% ছাড়)",
    chronicSubscriptionsDesc: "নিয়মিত ওষুধের জন্য স্বয়ংক্রিয় অটো-রিফিল সুবিধা",

    packagesDesc: "পরিবারের জন্য সর্বাধুনিক স্বাস্থ্য পরীক্ষা প্যাকেজ",
    fullBodyCheckup: "ফুল বডি হেলথ চেকআপ",
    fullBodyCheckupDesc: "৮০+ টি ভাইটাল হেলথ টেস্ট টেস্ট একটি প্যাকেজে",
    diabetesShield: "ডায়াবেটিস কেয়ার শিল্ড",
    diabetesShieldDesc: "HbA1c, লিপিড প্রোফাইল, কিডনি ও চোখের টেস্ট বাণ্ডেল",
    seniorWellness: "বয়স্কদের জন্য বিশেষ চেকআপ",
    seniorWellnessDesc: "হার্ট, হাড়ের ঘনত্ব ও শরীরের ভাইটাল অর্গান টেস্ট",

    // Role Login Modal
    multiRoleTitle: "মাল্টি-রোল অ্যাক্সেস কন্ট্রোল",
    selectAccountRole: "পোর্টাল অ্যাকাউন্ট রোল নির্বাচন করুন",
    chooseRoleDesc: "লগইন বা রেজিস্টার করার জন্য আপনার নির্দিষ্ট পোর্টাল রোল বেছে নিন।",
    rolePatientTitle: "রোগী / সাধারণ ব্যবহারকারী",
    patientBadge: "রোগী পোর্টাল",
    patientRoleDesc: "ডাক্তার বুক করুন, ল্যাব রিপোর্ট দেখুন ও ওষুধ অর্ডার করুন।",
    patientRole: "রোগী পোর্টাল",

    roleDoctorTitle: "লাইসেন্সপ্রাপ্ত ডাক্তার",
    doctorBadge: "ডাক্তার পোর্টাল",
    doctorRoleDesc: "রোগীর ভিডিও কনসালটেশন ও ই-প্রেসক্রিপশন প্রদান করুন।",
    doctorRole: "ডাক্তার পোর্টাল",

    roleLabTitle: "ডায়াগনস্টিক ল্যাব",
    labBadge: "ল্যাব পোর্টাল",
    labRoleDesc: "ল্যাব রিপোর্ট আপলোড করুন ও হোম স্যাম্পল কালেকশন প্রসেস করুন।",
    labRole: "ল্যাব পোর্টাল",

    rolePharmacyTitle: "ফার্মেসি পার্টনার",
    pharmacyBadge: "ফার্মেসি পোর্টাল",
    pharmacyRoleDesc: "ডিজিটাল ই-প্রেসক্রিপশন প্রসেস ও ওষুধ ডেলিভারি পরিচালনা করুন।",
    pharmacyRole: "ফার্মেসি পোর্টাল",

    loginAs: "লগইন করুন -",
    registerNewAccount: "নতুন অ্যাকাউন্ট রেজিস্টার করুন",

    // Emergency SOS Modal
    emergencySosDispatch: "জরুরি অ্যাম্বুলেন্স ডিসপ্যাচ",
    sosSubtitle: "২৪/৭ জরুরি অ্যাম্বুলেন্স ও মেডিকেল সাপোর্ট ইউনিট",
    gpsStatus: "জিটিএস লোকেশন স্ট্যাটাস",
    locatingGps: "লোকেশন খোঁজা হচ্ছে...",
    gpsLocked: "জিপিএস লক সম্পূর্ণ",
    demoLocation: "ডেমো লোকেশন",
    latitude: "অক্ষাংশ (Lat)",
    longitude: "দ্রাঘিমাংশ (Lng)",
    estimatedArrival: "আনুমানিক পৌঁছানোর সময়:",
    minsArrival: "৬ - ১০ মিনিট",
    refreshGps: "জিপিএস রিফ্রেশ করুন",
    ambulanceDispatched: "অ্যাম্বুলেন্স পাঠানো হয়েছে!",
    ambulanceEnRoute: "মেডিকেল ইমার্জেন্সি ইউনিট #৪০৯ আপনার জিপিএস লোকেশনে রওনা হয়েছে। মেডিকেল টিম অতিসত্বর কল করবে।",
    dispatchAmbulanceNow: "এখনই জরুরি অ্যাম্বুলেন্স পাঠান",
    transmittingGps: "ডিসপ্যাচ সেন্টারে জিপিএস পাঠানো হচ্ছে...",
    callNationalHotline: "জাতীয় হটলাইনে কল করুন (৯৯৯)",

    // Footer
    footerPartnerHeader: "স্বীকৃত হাসপাতাল নেটওয়ার্ক ও বিএমডিসি সনদপ্রাপ্ত পার্টনার",
    footerVerifiedNetwork: "ভেরিফায়েড নেটওয়ার্ক • ১০০% সার্টিফাইড",
    footerCompanyDesc: "বাংলাদেশের শীর্ষস্থানীয় ডিজিটাল হেলথকেয়ার প্ল্যাটফর্ম - যা রোগী, ডাক্তার, ল্যাব এবং ফার্মেসিকে একটি বিশ্বস্ত নেটওয়ার্কে যুক্ত করেছে।",
    footerPortalsHeader: "স্বাস্থ্যসেবা পোর্টালসমূহ",
    footerEmergencyHeader: "জরুরি ও হটলাইন সেবা",
    footerNationalHotlineLabel: "জাতীয় জরুরি হটলাইন",
    footerNationalHotlineSub: "অ্যাম্বুলেন্সের জন্য কল ৯৯৯",
    footerTelemedHotlineLabel: "২৪/৭ টেলিমেডিসিন হটলাইন",
    footerTelemedHotlineSub: "তাতক্ষণিক ডাক্তার পরামর্শ",
    footerSubscribeHeader: "স্বাস্থ্য বিষয়ক টিপস ও আপডেট",
    footerSubscribeDesc: "সাপ্তাহিক স্বাস্থ্য টিপস, বিশেষজ্ঞ পরামর্শ ও জরুরি অ্যালার্ট পেতে সাবস্ক্রাইব করুন।",
    enterEmailPlaceholder: "আপনার ইমেইল এড্রেস লিখুন...",
    subscribingButton: "সাবস্ক্রাইব করা হচ্ছে...",
    subscribeButton: "স্বাস্থ্য আপডেটে সাবস্ক্রাইব করুন",
    subscribeSuccessMessage: "ধন্যবাদ! আপনার ইমেইলে স্বাস্থ্য বিষয়ক আপডেট পাঠানো হয়েছে।",
    privacyPolicy: "প্রাইভেসি পলিসি",
    termsOfService: "টার্মস অব সার্ভিস",
    securityHipaa: "সিকিউরিটি ও হিাপা",

    // Theme & Lang
    themeLight: "লাইট",
    themeDark: "ডার্ক",
    themeAuto: "সিস্টেম অটো",
    selectLanguage: "ভাষা নির্বাচন করুন",
  },
  hi: {
    // Header & Navbar
    brandTagline: "स्वास्थ्य सेवा इकोसिस्टम",
    findDoctors: "डॉक्टर ढूंढें",
    diagnostics: "डायग्नोस्टिक्स",
    pharmacy: "फार्मेसी",
    healthPackages: "हेल्थ पैकेज",
    emergencySos: "इमरजेंसी 24/7",
    emergencySosFull: "24/7 आपातकालीन एम्बुलेंस सेवा",
    logIn: "लॉग इन करें",
    signUp: "साइन अप",
    selectRole: "पोर्टल भूमिका चुनें",

    // Omni Search
    searchPlaceholder: "डॉक्टर, लक्षण (जैसे: सीने में दर्द), या डायग्नोस्टिक टेस्ट खोजें...",
    searchButton: "खोजें",
    trendingSearches: "लोकप्रिय ट्रेंडिंग खोजें",
    noResultsFound: "कोई स्वास्थ्य सेवा नहीं मिली",
    noResultsSub: "'कार्डियोलॉजिस्ट', 'सीने में दर्द', या 'एमआरआई स्कैन' खोजकर प्रयास करें।",

    // Hero Section
    heroBadge: "सेवामित्र • स्मार्ट डिजिटल स्वास्थ्य सेवा",
    heroTitleLine1: "सरल और विश्वसनीय",
    heroTitleLine2: "डिजिटल स्वास्थ्य सेवा",
    heroTitleLine3: "आपकी उंगलियों पर।",
    heroSubtitle: "बीएमडीसी पंजीकृत डॉक्टरों द्वारा वीडियो परामर्श, 2 घंटे में दवा वितरण और होम लैब टेस्ट।",
    bmdcVerifiedBadge: "बीएमडीसी प्रमाणित",
    telemedActiveBadge: "24/7 वीडियो कॉल",
    expressDeliveryBadge: "2 घंटे डिलीवरी",

    // Hero Slider
    slide1Badge: "बीएमडीसी प्रमाणित डॉक्टर",
    slide1Title: "विशेषज्ञ डॉक्टर परामर्श",
    slide1Sub: "1,200+ अनुभवी बीएमडीसी पंजीकृत डॉक्टर",

    slide2Badge: "पारिवारिक स्वास्थ्य सुरक्षा",
    slide2Title: "संपूर्ण परिवार की स्वास्थ्य सेवा",
    slide2Sub: "घर बैठे आसानी से सभी सुविधाएं प्राप्त करें",

    slide3Badge: "24/7 तुरंत वीडियो कॉल",
    slide3Title: "तत्काल टेलीमेडिसिन सेवा",
    slide3Sub: "60 सेकंड के भीतर प्रमाणित डॉक्टरों से जुड़ें",

    slide4Badge: "2 घंटे में त्वरित डिलीवरी",
    slide4Title: "100% असली दवा आपूर्ति",
    slide4Sub: "मॉडल फार्मेसी से सीधे होम डिलीवरी",

    // Bento Grid
    bentoHeaderBadge: "सेवामित्र स्वास्थ्य इकोसिस्टम",
    bentoHeaderTitle: "डिजिटल स्वास्थ्य सेवा का",
    bentoHeaderTitleHighlight: "आधुनिक समाधान",
    bentoHeaderSubtitle: "स्मार्ट दवा रिमाइंडर से लेकर 2 घंटे की एक्सप्रेस दवा डिलीवरी तक — आपके परिवार की संपूर्ण स्वास्थ्य सेवा।",

    alarmBadge: "एआई दवा रिमाइंडर",
    alarmTitle: "स्मार्ट दवा अलार्म और खुराक ट्रैकर",
    alarmDesc: "समय पर दवा खाना कभी न भूलें। स्वचालित पुश सूचनाएं, व्हाट्सएप अलर्ट और वॉयस रिमाइंडर सुविधा।",
    alarmBtn: "दवा की अनुसूची जोड़ें",

    telemedBadge: "बीएमडीसी पंजीकृत डॉक्टर",
    telemedTitle: "24/7 लाइव एचडी वीडियो परामर्श",
    telemedDesc: "केवल 60 सेकंड में अनुभवी डॉक्टरों के साथ लाइव वीडियो परामर्श प्राप्त करें और डिजिटल प्रिस्क्रिप्शन पाएं।",
    telemedBtn: "डॉक्टर से अभी परामर्श करें",

    pharmacyCardBadge: "100% असली दवाएं",
    pharmacyTitle: "2 घंटे में एक्सप्रेस फार्मेसी डिलीवरी",
    pharmacyDesc: "तापमान नियंत्रित कोल्ड-चेन बॉक्स में सीधे मॉडल फार्मेसी से 100% असली दवाएं प्राप्त करें।",
    pharmacyBtn: "प्रिस्क्रिप्शन के साथ दवा ऑर्डर करें",

    labCardBadge: "ISO 15189 प्रमाणित",
    labTitle: "होम लैब सैंपल कलेक्शन",
    labDesc: "प्रमाणित लैब तकनीशियन आपके घर से सैंपल एकत्र करेंगे। 12 घंटे के भीतर डिजिटल रिपोर्ट।",
    labBtn: "होम लैब टेस्ट बुक करें",

    // Specialty Carousel
    specialtyCategory: "विशेषज्ञ चिकित्सा श्रेणियां",
    specialtyTitle: "सभी चिकित्सा विशेषज्ञताएं",

    // Stats Counter
    liveActivity: "लाइव गतिविधि:",
    liveActivityFeed: "डॉ. फराह अहमद ने ढाका में लाइव वीडियो परामर्श पूरा किया • 14 सेकंड पहले",
    statConsultations: "सफल चिकित्सा परामर्श",
    statConsultationsSub: "बांग्लादेश के 64 जिलों में उपलब्ध",
    statDoctors: "बीएमडीसी प्रमाणित डॉक्टर",
    statDoctorsSub: "सत्यापित बीएमडीसी डॉक्टर",
    statDelivery: "समय पर एक्सप्रेस डिलीवरी",
    statDeliverySub: "औसत डिलीवरी समय केवल 42 मिनट",
    statRating: "मरीजों की संतुष्टि रेटिंग",
    statRatingSub: "14,000+ सत्यापित समीक्षाओं पर आधारित",

    // Mega Menu Descriptions & Services
    findDoctorsDesc: "सत्यापित विशेषज्ञों से जुड़ें और ऑनलाइन परामर्श लें",
    specialistSearch: "विशेषज्ञ डॉक्टर खोजें",
    specialistSearchDesc: "50+ विशेषज्ञताओं के डॉक्टर खोजें और अपॉइंटमेंट लें",
    telemedicine: "ऑनलाइन वीडियो परामर्श",
    telemedicineDesc: "24/7 शीर्ष डॉक्टरों के साथ लाइव वीडियो परामर्श",
    emergencySpecialists: "आपातकालीन विशेषज्ञ",
    emergencySpecialistsDesc: "तत्काल आईसीयू और आपातकालीन विशेषज्ञ सेवाएं",

    diagnosticsDesc: "घर पर लैब टेस्ट और सैंपल कलेक्शन बुक करें",
    homeCollection: "होम लैब सैंपल कलेक्शन",
    homeCollectionDesc: "सत्यापित लैब तकनीशियन आपके घर से सैंपल लेंगे",
    imagingCenters: "डायग्नोस्टिक इमेजिंग सेंटर",
    imagingCentersDesc: "एमआरआई, सीटी स्कैन, एक्स-रे और अल्ट्रासाउंड बुकिंग",
    reportVault: "डिजिटल लैब रिपोर्ट तिजोरी",
    reportVaultDesc: "24 घंटे के भीतर डिजिटल लैब रिपोर्ट प्राप्त करें",

    pharmacyMenuDesc: "असली दवाएं और स्वास्थ्य उत्पाद ऑनलाइन ऑर्डर करें",
    uploadPrescription: "प्रिस्क्रिप्शन अपलोड करें",
    uploadPrescriptionDesc: "एआई प्रिस्क्रिप्शन स्कैन और फार्मासिस्ट सत्यापन",
    rapidExpress: "2 घंटे में रैपिড डिलीवरी",
    rapidExpressDesc: "आपातकालीन दवाएं केवल 2 घंटे में प्राप्त करें",
    chronicSubscriptions: "मासिक दवा रिफिल (15% छूट)",
    chronicSubscriptionsDesc: "नियमित दवाओं के लिए स्वचालित ऑटो-रिफिल",

    packagesDesc: "आपके और परिवार के लिए संपूर्ण स्वास्थ्य जांच",
    fullBodyCheckup: "फुल बॉडी चेकअप",
    fullBodyCheckupDesc: "एक ही पैकेज में 80+ महत्वपूर्ण स्वास्थ्य परीक्षण",
    diabetesShield: "डायबिटीज केयर शील्ड",
    diabetesShieldDesc: "HbA1c, लिपिड प्रोफाइल, किडनी और आंख जांच बंडल",
    seniorWellness: "वरिष्ठ नागरिक स्वास्थ्य जांच",
    seniorWellnessDesc: "हृदय, हड्डी का घनत्व और अंग स्वास्थ्य परीक्षण",

    // Role Login Modal
    multiRoleTitle: "मल्टी-रोल एक्सेस कंट्रोल",
    selectAccountRole: "पोर्टल खाता भूमिका चुनें",
    chooseRoleDesc: "लॉग इन या रजिस्टर करने के लिए अपनी पोर्टल भूमिका चुनें।",
    rolePatientTitle: "मरीज़ / सामान्य उपयोगकर्ता",
    patientBadge: "मरीज़ पोर्टल",
    patientRoleDesc: "डॉक्टर बुक करें, लैब रिपोर्ट देखें और दवाएं ऑर्डर करें।",
    patientRole: "मरीज़ पोर्टल",

    roleDoctorTitle: "सत्यापित डॉक्टर",
    doctorBadge: "डॉक्टर पोर्टल",
    doctorRoleDesc: "मरीज़ वीडियो परामर्श और ई-प्रिस्क्रिप्शन प्रबंधित करें।",
    doctorRole: "डॉक्टर पोर्टल",

    roleLabTitle: "डायग्नोस्टिक लैब",
    labBadge: "लैब पोर्टल",
    labRoleDesc: "लैब रिपोर्ट अपलोड करें और होम सैंपल कलेक्शन प्रोसेस करें।",
    labRole: "लैब पोर्टल",

    rolePharmacyTitle: "फार्मेसी पार्टनर",
    pharmacyBadge: "फार्मेसी पोर्टल",
    pharmacyRoleDesc: "डिजिटल ई-प्रिस्क्रिप्शन और दवा डिलीवरी प्रबंधित करें।",
    pharmacyRole: "फार्मेसी पोर्टल",

    loginAs: "लॉग इन करें -",
    registerNewAccount: "नया खाता पंजीकृत करें",

    // Emergency SOS Modal
    emergencySosDispatch: "आपातकालीन एम्बुलेंस सेवा",
    sosSubtitle: "24/7 त्वरित एम्बुलेंस और चिकित्सा सहायता इकाई",
    gpsStatus: "जीपीएस स्थान स्थिति",
    locatingGps: "स्थान खोजा जा रहा है...",
    gpsLocked: "जीपीएस स्थान लॉक",
    demoLocation: "डेमो स्थान",
    latitude: "अक्षांश (Lat)",
    longitude: "देशांतर (Lng)",
    estimatedArrival: "अनुमानित आगमन समय:",
    minsArrival: "6 - 10 मिनट",
    refreshGps: "जीपीएस रिफ्रेश करें",
    ambulanceDispatched: "एम्बुलेंस भेज दी गई है!",
    ambulanceEnRoute: "मेडिकल इमरजेंसी यूनिट #409 आपके जीपीएस स्थान पर रवाना हो चुकी है।",
    dispatchAmbulanceNow: "अभी आपातकालीन एम्बुलेंस भेजें",
    transmittingGps: "जीपीएस डेटा ट्रांसमिट हो रहा है...",
    callNationalHotline: "राष्ट्रीय हेल्पलाइन पर कॉल करें (999)",

    // Footer
    footerPartnerHeader: "मान्यता प्राप्त अस्पताल नेटवर्क और सत्यापित पार्टनर",
    footerVerifiedNetwork: "सत्यापित नेटवर्क • 100% प्रमाणित",
    footerCompanyDesc: "बांग्लादेश का प्रमुख डिजिटल हेल्थकेयर प्लेटफॉर्म जो मरीजों, डॉक्टरों, लैब और फार्मेसी को जोड़ता है।",
    footerPortalsHeader: "स्वास्थ्य सेवा पोर्टल",
    footerEmergencyHeader: "आपातकालीन सेवाएं",
    footerNationalHotlineLabel: "राष्ट्रीय आपातकालीन हेल्पलाइन",
    footerNationalHotlineSub: "एम्बुलेंस के लिए 999 पर कॉल करें",
    footerTelemedHotlineLabel: "24/7 टेलीमेडिसिन हेल्पलाइन",
    footerTelemedHotlineSub: "तत्काल डॉक्टर परामर्श",
    footerSubscribeHeader: "स्वास्थ्य टिप्स और अपडेट",
    footerSubscribeDesc: "साप्ताहिक स्वास्थ्य टिप्स और आपातकालीन अलर्ट प्राप्त करने के लिए सब्सक्राइब करें।",
    enterEmailPlaceholder: "अपना ईमेल दर्ज करें...",
    subscribingButton: "सब्सक्राइब हो रहा है...",
    subscribeButton: "स्वास्थ्य अपडेट सब्सक्राइब करें",
    subscribeSuccessMessage: "धन्यवाद! आपके ईमेल पर स्वास्थ्य अपडेट भेजे गए हैं।",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    securityHipaa: "सुरक्षा और HIPAA",

    // Theme & Lang
    themeLight: "लाइट",
    themeDark: "डार्क",
    themeAuto: "सिस्टम ऑटो",
    selectLanguage: "भाषा चुनें",
  },
} as const;
