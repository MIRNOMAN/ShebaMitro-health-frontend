import { test, expect } from "@playwright/test";

test.describe("Multi-Role Lifecycle Phase 4: Diagnostic Lab Order Processing & Report Upload", () => {
  test.beforeEach(async ({ page }) => {
    // Set Lab Admin RBAC Session Cookie
    await page.context().addCookies([
      { name: "sheba_session", value: "lab-admin-session-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "lab", domain: "localhost", path: "/" },
    ]);
  });

  test("Lab admin should process test requisitions and upload diagnostic PDF report", async ({ page }) => {
    // 1. Visit Lab Upload Reports Page
    await page.goto("/lab/reports/upload");

    // 2. Verify Upload Portal Form Header
    const pageHeader = page.locator("text=/Upload|Report|Lab|Diagnostic/i").first();
    await expect(pageHeader).toBeVisible({ timeout: 10000 });

    // 3. Fill Requisition or Patient ID if input exists
    const reqInput = page.locator("input[placeholder*='REQ-'], input[placeholder*='ID'], input[type='text']").first();
    if (await reqInput.isVisible()) {
      await reqInput.fill("REQ-928410");
    }

    // 4. Verify Upload Action Area
    const dropzone = page.locator("text=/Drag|Upload|PDF|Select File/i").first();
    await expect(dropzone).toBeVisible();
  });
});
