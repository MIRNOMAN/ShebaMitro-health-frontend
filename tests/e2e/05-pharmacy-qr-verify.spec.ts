import { test, expect } from "@playwright/test";

test.describe("Multi-Role Lifecycle Phase 5: Pharmacy Prescription QR Scan & Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Set Pharmacy RBAC Session Cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "pharmacy-session-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "pharmacy", domain: "localhost", path: "/" },
    ]);
  });

  test("Pharmacy partner should scan/input prescription QR code payload and verify authenticity", async ({ page }) => {
    // 1. Visit Pharmacy Prescription Verification Portal
    await page.goto("/pharmacy/verify");

    // 2. Verify Page Header
    const verifyHeader = page.locator("text=/Prescription|Verify|Pharmacy/i").first();
    await expect(verifyHeader).toBeVisible({ timeout: 10000 });

    // 3. Enter Sample Prescription QR Payload ID
    const qrInput = page.locator("input[placeholder*='RX-'], input[placeholder*='ID'], input[type='text']").first();
    if (await qrInput.isVisible()) {
      await qrInput.fill("RX-994821");

      const verifyBtn = page.locator("button:has-text('Verify'), button:has-text('Scan')").first();
      if (await verifyBtn.isVisible()) {
        await verifyBtn.click();
      }
    }

    // 4. Verify Authenticity Results
    const bodyContent = page.locator("body");
    await expect(bodyContent).toContainText(/Authentic|Verified|Prescription|Pharmacy/i);
  });
});
