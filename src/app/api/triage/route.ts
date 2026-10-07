import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { TriageResponseData, UrgencyLevel, DoctorSpecialtyCard } from "@/features/triage/types/triage";

const NESTJS_TRIAGE_SERVICE_URL =
  process.env.NESTJS_TRIAGE_SERVICE_URL || "http://localhost:3001/ai/triage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symptoms, language = "en" } = body || {};

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: "Symptom description is required." },
        { status: 400 }
      );
    }

    // 1. Attempt connection to NestJS AI Triage Microservice
    try {
      const nestResponse = await fetch(NESTJS_TRIAGE_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ symptoms, language }),
        signal: AbortSignal.timeout(3000), // 3s timeout for microservice
      });

      if (nestResponse.ok) {
        const data: TriageResponseData = await nestResponse.json();
        return NextResponse.json(data);
      }
    } catch (microserviceErr) {
      // NestJS microservice offline or unreachable -> fallback gracefully to intelligent edge triage engine
      console.warn("NestJS AI microservice unreachable, operating in resilient edge mode:", microserviceErr);
    }

    // 2. Intelligent Medical Triage NLP Engine (Handles English, Bengali, & Banglish)
    const resultData = analyzeSymptomsWithEdgeAI(symptoms.trim());

    return NextResponse.json(resultData);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process triage request.", details: err?.message },
      { status: 500 }
    );
  }
}

/**
 * Robust Multi-lingual Symptom Triage Analyzer
 * Supports Banglish ("buke betha", "matha betha", "jhor"), Bengali ("বুক ব্যথা", "জ্বর"), & English ("chest pain").
 */
function analyzeSymptomsWithEdgeAI(input: string): TriageResponseData {
  const text = input.toLowerCase();

  // Keyword matchers
  const isEmergency =
    /chest pain|buke betha|buke batha|buke chap|shortness of breath|shash kosto|shas kosto|unconscious|gyan hara|stroke|heart attack|paralysis|blood vomit|rokto bomi|severe bleeding|gohin rokto/i.test(
      text
    ) || /বুক ব্যথা|বুক ব্যাথা|শ্বাসকষ্ট|জ্ঞান হারা|স্ট্রোক|হার্ট অ্যাটাক|রক্ত বমি|রক্তপাত/i.test(text);

  const isUrgent =
    /high fever|tivro jhor|tivro jor|severe headache|matha betha|matha batha|abdominal pain|pete betha|pet batha|fainting|dizziness|chokh dhadha|persistent vomiting|kashi|cough with blood/i.test(
      text
    ) || /উচ্চ জ্বর|তীব্র মাথাব্যথা|পেটে ব্যথা|বমি|কাশি|রক্ত কাশি/i.test(text);

  const isNeurological = /headache|matha betha|dizziness|matha ghora|seizure|giddiness|মাথাব্যথা|মাথা ঘোরা/i.test(text);
  const isCardio = /chest|heart|buke|batha|palpitation|buke dhukdhuk|বুক|হৃদরোগ|বুক ধড়ফড়/i.test(text);
  const isPulmo = /cough|breath|shash|shas|asthma|cold|kashi|thanda|কাশি|শ্বাস|অ্যাজমা/i.test(text);
  const isGastro = /stomach|pet|pete|digestion|acidity|gas|vomit|bomi|diarrhea|পেট|এসিডিটি|বমি/i.test(text);
  const isDerma = /skin|rash|itching|khujli|chulkani|allergy|চর্ম|চুলকানি|এলার্জি/i.test(text);
  const isPediatric = /baby|child|babu|baccha|shishu|বাচ্চা|শিশু/i.test(text);

  let urgency: UrgencyLevel = "ROUTINE";
  let urgencyScore = 45;
  let urgencyTitle = "Routine Consultation Recommended";
  let urgencyTitleBn = "সাধারণ চিকিৎসক পরামর্শের পরামর্শ দেওয়া হচ্ছে";
  let summary = `Evaluation completed for reported symptoms: "${input}".`;
  let summaryBn = `আপনার প্রদানকৃত লক্ষণ: "${input}" এর ভিত্তিতে প্রাথমিক মূল্যায়ন সম্পন্ন হয়েছে।`;
  let advice: string[] = [];
  let adviceBn: string[] = [];
  let redFlags: string[] = [];
  let redFlagsBn: string[] = [];

  if (isEmergency) {
    urgency = "EMERGENCY";
    urgencyScore = 95;
    urgencyTitle = "CRITICAL EMERGENCY - IMMEDIATE ACTION REQUIRED";
    urgencyTitleBn = "জরুরি অবস্থা - অবিলম্বে হাসপাতালে যান বা ৯৯৯ কল করুন";
    summary = "Symptoms indicate potential cardiovascular or respiratory distress requiring urgent emergency care.";
    summaryBn = "আপনার লক্ষণগুলো কার্ডিওভাসকুলার বা শ্বাসনালীর তীব্র জটিলতার ইঙ্গিত দিচ্ছে। অবিলম্বে জরুরি বিভাগে যান।";
    advice = [
      "Do not drive yourself to the clinic; call emergency dispatch immediately.",
      "Rest in a comfortable position and keep airways clear.",
      "Keep patient calm and avoid physical exertion."
    ];
    adviceBn = [
      "নিজে গাড়ি চালাবেন না; দ্রুত ৯৯৯ বা অ্যাম্বুলেন্স সার্ভিসেস কল করুন।",
      "আরামদায়ক পজিশনে শুয়ে বা বসে থাকুন এবং বায়ুপ্রবাহ নিশ্চিত করুন।",
      "রোগীকে শান্ত রাখুন এবং অতিরিক্ত মানসিক বা শারীরিক চাপ এড়ান।"
    ];
    redFlags = ["Radiating arm/jaw pain", "Sudden loss of consciousness", "Blue lips or nail beds"];
    redFlagsBn = ["হাতে বা থুতনিতে ব্যথা ছড়িয়ে পড়া", "হঠাৎ জ্ঞান হারানো", "ঠোঁট বা নখ নীল হয়ে যাওয়া"];
  } else if (isUrgent) {
    urgency = "URGENT";
    urgencyScore = 75;
    urgencyTitle = "Urgent Specialist Evaluation Recommended";
    urgencyTitleBn = "আশু বিশেষজ্ঞ ডাক্তারের মূল্যায়ন প্রয়োজন (১২-২৪ ঘণ্টা)";
    summary = "Your symptoms warrant prompt evaluation by a registered specialist physician within 12 to 24 hours.";
    summaryBn = "আপনার লক্ষণ অনুযায়ী আগামী ১২ থেকে ২৪ ঘণ্টার মধ্যে বিশেষজ্ঞ ডাক্তারের সরাসরি বা ভিডিও পরামর্শ নেওয়া আবশ্যক।";
    advice = [
      "Book an urgent video consultation or chamber appointment today.",
      "Stay hydrated and avoid self-medication without professional advice.",
      "Log your temperature and symptoms every 4 hours."
    ];
    adviceBn = [
      "আজই জরুরি ভিডিও কনসালটেশন বা চ্যাম্বার অ্যাপয়েন্টমেন্ট বুক করুন।",
      "পর্যাপ্ত পানি পান করুন এবং চিকিৎসকের পরামর্শ ছাড়া অ্যান্ট্রিবায়োটিক গ্রহণ করবেন না।",
      "প্রতি ৪ ঘণ্টা পরপর তাপমাত্রা ও শারীরিক অনুভূতি নোট করুন।"
    ];
    redFlags = ["High fever over 103°F", "Severe abdominal tenderness", "Shortness of breath on exertion"];
    redFlagsBn = ["১০৩° ফারেনহাইটের বেশি জ্বর", "পেটে তীব্র স্পর্শকাতর ব্যথা", "হাঁটাহাঁটিতে শ্বাসকষ্ট"];
  } else {
    urgency = "ROUTINE";
    urgencyScore = 40;
    urgencyTitle = "Routine Teleconsultation & Primary Care";
    urgencyTitleBn = "সাধারণ টেলিমেডিসিন পরামর্শ";
    summary = "Symptoms appear mild to moderate. A standard video appointment with a physician is suggested.";
    summaryBn = "লক্ষণগুলো মৃদু ও স্থিতিশীল বলে মনে হচ্ছে। সাধারণ ডাক্তারের পরামর্শের মাধ্যমে স্বাস্থ্য তদারকি নিশ্চিত করুন।";
    advice = [
      "Schedule a teleconsultation with a BMDC certified doctor.",
      "Maintain adequate rest and nutritional intake.",
      "Monitor for any progression of symptoms over the next 48 hours."
    ];
    adviceBn = [
      "বিএমডিসি নিবন্ধিত ডাক্তারের সাথে ভিডিও কলের অ্যাপয়েন্টমেন্ট বুক করুন।",
      "পর্যাপ্ত বিশ্রাম ও পুষ্টিকর খাবার গ্রহণ করুন।",
      "আগামী ৪৮ ঘণ্টায় লক্ষণের কোনো পরিবর্তন হয় কিনা খেয়াল রাখুন।"
    ];
    redFlags = ["Symptoms persisting past 5 days", "Unexplained weight loss"];
    redFlagsBn = ["৫ দিনের বেশি লক্ষণ স্থায়ী হওয়া", "অযাচিতভাবে দ্রুত ওজন হ্রাস"];
  }

  // Determine specialty recommendation cards
  const recommendedSpecialties: DoctorSpecialtyCard[] = [];

  if (isCardio || isEmergency) {
    recommendedSpecialties.push({
      id: "cardiology",
      nameEn: "Cardiology Specialist",
      nameBn: "হৃদরোগ ও কার্ডিওলজি বিশেষজ্ঞ",
      descriptionEn: "Expert diagnosis for chest pain, heart palpitations, & blood pressure.",
      descriptionBn: "বুক ব্যথা, হার্টবিট বৃদ্ধি ও উচ্চ রক্তচাপের বিশেষজ্ঞ চিকিৎসা।",
      matchingScore: 98,
      iconName: "HeartPulse",
      bookingUrl: "/doctors?specialty=cardiology",
      availableDoctorsCount: 14,
      avgConsultationFeeBDT: 1000,
      badgeTag: "Top Recommended",
    });
  }

  if (isNeurological || isUrgent) {
    recommendedSpecialties.push({
      id: "neurology",
      nameEn: "Neurology & Brain Specialist",
      nameBn: "স্নায়ুরোগ ও নিউরোলজি বিশেষজ্ঞ",
      descriptionEn: "Diagnosis for severe migraine, dizziness, numbness, & nerve care.",
      descriptionBn: "মাইগ্রেন, তীব্র মাথা ব্যথা, মাথা ঘোরা ও স্নায়বিক সমস্যার পরামর্শ।",
      matchingScore: 92,
      iconName: "Brain",
      bookingUrl: "/doctors?specialty=neurology",
      availableDoctorsCount: 9,
      avgConsultationFeeBDT: 1200,
      badgeTag: "High Match",
    });
  }

  if (isPulmo) {
    recommendedSpecialties.push({
      id: "pulmonology",
      nameEn: "Pulmonology & Chest Specialist",
      nameBn: "বক্ষব্যাধি ও পালমোনোলজি বিশেষজ্ঞ",
      descriptionEn: "Specialized care for chronic cough, asthma, bronchitis, & lung wellness.",
      descriptionBn: "দীর্ঘমেয়াদী কাশি, অ্যাজমা, ব্রঙ্কাইটিস ও ফুসফুসের বিশেষ সেবা।",
      matchingScore: 95,
      iconName: "Stethoscope",
      bookingUrl: "/doctors?specialty=pulmonology",
      availableDoctorsCount: 11,
      avgConsultationFeeBDT: 900,
      badgeTag: "Specialist Match",
    });
  }

  if (isGastro) {
    recommendedSpecialties.push({
      id: "gastroenterology",
      nameEn: "Gastroenterology & Liver",
      nameBn: "মেডিসিন ও পরিপাকতন্ত্র বিশেষজ্ঞ",
      descriptionEn: "Targeted treatment for acidity, stomach pain, IBS, & liver health.",
      descriptionBn: "এসিডিটি, পেটের ব্যথা, আইবিএস ও লিভার সমস্যার সমাধান।",
      matchingScore: 89,
      iconName: "Activity",
      bookingUrl: "/doctors?specialty=gastroenterology",
      availableDoctorsCount: 16,
      avgConsultationFeeBDT: 800,
      badgeTag: "Gastro Match",
    });
  }

  if (isDerma) {
    recommendedSpecialties.push({
      id: "dermatology",
      nameEn: "Dermatology Specialist",
      nameBn: "চর্ম ও যৌনরোগ বিশেষজ্ঞ",
      descriptionEn: "Care for skin allergies, rashes, itching, & dermatological conditions.",
      descriptionBn: "চামড়ার অ্যালার্জি, র‍্যাশ, চুলকানি ও ত্বকের যে কোনো পরামর্শ।",
      matchingScore: 88,
      iconName: "Sparkles",
      bookingUrl: "/doctors?specialty=dermatology",
      availableDoctorsCount: 8,
      avgConsultationFeeBDT: 700,
      badgeTag: "Skin Match",
    });
  }

  // Always ensure at least General Medicine is present
  if (recommendedSpecialties.length === 0 || !isEmergency) {
    recommendedSpecialties.push({
      id: "internal-medicine",
      nameEn: "Internal Medicine Specialist",
      nameBn: "মেডিসিন বিশেষজ্ঞ (Internal Medicine)",
      descriptionEn: "Comprehensive medical evaluation for multi-system health concerns.",
      descriptionBn: "যে কোনো সাধারণ স্বাস্থ্য সমস্যা ও মেডিসিন সংক্রান্ত বিশ্বস্ত পরামর্শ।",
      matchingScore: 85,
      iconName: "UserCheck",
      bookingUrl: "/doctors?specialty=internal-medicine",
      availableDoctorsCount: 24,
      avgConsultationFeeBDT: 700,
      badgeTag: "General Physician",
    });
  }

  return {
    urgency,
    urgencyScore,
    urgencyTitle,
    urgencyTitleBn,
    summary,
    summaryBn,
    advice,
    adviceBn,
    redFlags,
    redFlagsBn,
    recommendedSpecialties,
    sourceService: "Fallback-Edge-AI",
    timestamp: new Date().toISOString(),
  };
}
