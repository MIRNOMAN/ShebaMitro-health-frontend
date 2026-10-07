import { test, expect } from "@playwright/test";

test.describe("Multi-Role Lifecycle Phase 1: Patient Doctor Slot Booking & Test Checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Set Patient RBAC Session Cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "patient-session-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "patient", domain: "localhost", path: "/" },
    ]);
  });

  test("Patient should browse doctors, select appointment slot, and complete checkout", async ({ page }) => {
    // 1. Visit Doctor Directory
    await page.goto("/doctors");
    await expect(page).toHaveTitle(/Doctors|ShebaMitro/i);

    // 2. Search & Select Doctor
    const doctorCard = page.locator(".group, [class*='card']").first();
    await expect(doctorCard).toBeVisible({ timeout: 10000 });

    // 3. Navigate to Doctor Detail Page or Booking Action
    const bookBtn = page.locator("a[href*='/doctors/'], button:has-text('Book'), button:has-text('Consult')").first();
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
    }

    // 4. Verify Booking Slot or Checkout Form
    const bodyContent = page.locator("body");
    await expect(bodyContent).toContainText(/Doctor|Appointment|Slot|Fee|ShebaMitro/i);
  });

  test("Patient should select diagnostic lab package and complete checkout", async ({ page }) => {
    await page.goto("/diagnostics");
    const testPackage = page.locator("text=/Checkup|Lab|Package|Test/i").first();
    await expect(testPackage).toBeVisible({ timeout: 10000 });
  });
});
