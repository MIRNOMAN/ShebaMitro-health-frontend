import type { TriageResponseData } from "../types/triage";

export async function fetchSymptomTriage(
  symptoms: string,
  language: "en" | "bn" | "banglish" = "en"
): Promise<TriageResponseData> {
  const response = await fetch("/api/triage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to analyze symptoms.");
  }

  return response.json();
}
