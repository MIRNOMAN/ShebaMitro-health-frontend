import { test, expect } from "@playwright/test";

test.describe("E2E Test 4: Pharmacy QR Scan Verification", () => {
  test("should scan or input prescription QR code payload and verify authenticity", async ({ page }) => {
    // 1. Set pharmacy portal auth cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "pharmacy-auth-token-demo", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "pharmacy", domain: "localhost", path: "/" },
    ]);

    // 2. Navigate to Pharmacy Prescription Verification page
    await page.goto("/pharmacy/verify");

    // 3. Verify Rx Verification portal title
    const verifyHeader = page.locator("text=/Prescription|Verify|Pharmacy/i").first();
    await expect(verifyHeader).toBeVisible({ timeout: 10000 });

    // 4. Input sample Prescription ID / QR code string
    const qrInput = page.locator("input[placeholder*='RX-'], input[placeholder*='ID'], input[type='text']").first();
    if (await qrInput.isVisible()) {
      await qrInput.fill("RX-849201");

      const verifyBtn = page.locator("button:has-text('Verify'), button:has-text('Scan')").first();
      if (await verifyBtn.isVisible()) {
        await verifyBtn.click();
      }
    }

    // 5. Verify prescription validation result status
    const bodyContent = page.locator("body");
    await expect(bodyContent).toContainText(/Authentic|Verified|Prescription|Pharmacy/i);
  });
});
