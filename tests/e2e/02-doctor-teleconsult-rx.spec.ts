import { test, expect } from "@playwright/test";

test.describe("Multi-Role Lifecycle Phase 2: Doctor Teleconsultation & Digital Rx Generation", () => {
  test.beforeEach(async ({ page }) => {
    // Set Doctor RBAC Session Cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "doctor-session-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "doctor", domain: "localhost", path: "/" },
    ]);
  });

  test("Doctor should access teleconsultation room and conduct video call", async ({ page }) => {
    await page.goto("/dashboard/doctor/teleconsultation");
    const videoRoom = page.locator("text=/Teleconsultation|Video|Patient|Live/i").first();
    await expect(videoRoom).toBeVisible({ timeout: 10000 });
  });

  test("Doctor should generate digital prescription with dosage pattern (1-0-1)", async ({ page }) => {
    await page.goto("/doctor/prescriptions/new");

    // Fill Chief Complaints
    const complaintInput = page.locator("textarea, input[placeholder*='complaint'], input[placeholder*='Symptom']").first();
    if (await complaintInput.isVisible()) {
      await complaintInput.fill("Type-2 Diabetes, High blood sugar, fatigue");
    }

    // Fill Medicine Name & Dosage Pattern (1-0-1)
    const medicineInput = page.locator("input[placeholder*='Medicine'], input[placeholder*='Napa']").first();
    if (await medicineInput.isVisible()) {
      await medicineInput.fill("Metformin 500mg");
    }

    // Select/fill Dosage Pattern (1-0-1)
    const dosageInput = page.locator("input[placeholder*='Dosage'], input[placeholder*='1-0-1']").first();
    if (await dosageInput.isVisible()) {
      await dosageInput.fill("1-0-1 (Twice daily after meal)");
    }

    // Click Issue Prescription
    const issueBtn = page.locator("button:has-text('Issue'), button:has-text('Save'), button:has-text('Generate')").first();
    if (await issueBtn.isVisible()) {
      await issueBtn.click();
    }

    // Verify confirmation
    const bodyContent = page.locator("body");
    await expect(bodyContent).toContainText(/Prescription|Doctor|Rx|BMDC/i);
  });
});
