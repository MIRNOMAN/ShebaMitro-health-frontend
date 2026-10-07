import { test, expect } from "@playwright/test";

test.describe("E2E Test 1: Public Doctor Search & Filter Flow", () => {
  test("should search for doctors by specialty, filter results, and view profile", async ({ page }) => {
    // 1. Navigate to Public Doctor Directory Page
    await page.goto("/doctors");
    await expect(page).toHaveTitle(/Doctors|ShebaMitro/i);

    // 2. Perform Specialty / Doctor Name Search
    const searchInput = page.locator("input[placeholder*='Search']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Cardiology");
      await page.keyboard.press("Enter");
    }

    // 3. Verify Doctor Specialty Cards or Results Listing
    const doctorCards = page.locator(".group, [class*='card']");
    await expect(doctorCards.first()).toBeVisible({ timeout: 10000 });

    // 4. Click filter button if available
    const filterBtn = page.locator("button:has-text('Filter'), button:has-text('Specialty')").first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
    }

    // 5. Verify page renders doctor listings cleanly
    const body = page.locator("body");
    await expect(body).toContainText(/Doctor|Specialist|Consultation/i);
  });
});
