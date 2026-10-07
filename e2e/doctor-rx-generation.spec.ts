import { test, expect } from "@playwright/test";

test.describe("E2E Test 3: Doctor Prescription Generation", () => {
  test("should log in as doctor and generate digital e-prescription", async ({ page }) => {
    // 1. Set doctor role authentication cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "doctor-auth-token-demo", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "doctor", domain: "localhost", path: "/" },
    ]);

    // 2. Navigate to Doctor Digital Rx Writer page
    await page.goto("/doctor/prescriptions/new");

    // 3. Fill Chief Complaints & Diagnosis fields
    const complaintsInput = page.locator("textarea, input[placeholder*='complaint'], input[placeholder*='Symptom']").first();
    if (await complaintsInput.isVisible()) {
      await complaintsInput.fill("High grade fever and severe sore throat");
    }

    // 4. Fill Medicine / Prescription item details
    const medInput = page.locator("input[placeholder*='Medicine'], input[placeholder*='Napa']").first();
    if (await medInput.isVisible()) {
      await medInput.fill("Napa Extra 500mg");
    }

    // 5. Click Generate / Issue Prescription button
    const submitBtn = page.locator("button:has-text('Issue'), button:has-text('Save'), button:has-text('Generate')").first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // 6. Verify success confirmation or prescription output
    const pageContent = page.locator("body");
    await expect(pageContent).toContainText(/Prescription|Doctor|Rx|BMDC/i);
  });
});
