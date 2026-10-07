import { test, expect } from "@playwright/test";

test.describe("E2E Test 2: Patient Login and Medicine Alarm Snooze", () => {
  test("should log in as patient, trigger medicine alarm modal, and click snooze", async ({ page }) => {
    // 1. Set role cookie for patient dashboard access
    await page.context().addCookies([
      { name: "sheba_session", value: "patient-auth-token-demo", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "patient", domain: "localhost", path: "/" },
    ]);

    // 2. Navigate to Patient Dashboard
    await page.goto("/dashboard/patient");

    // 3. Verify Patient Medicine Alarm Deck widget
    const alarmWidget = page.locator("text=Patient Medicine Alarm Deck").first();
    await expect(alarmWidget).toBeVisible({ timeout: 10000 });

    // 4. Click Test Alarm Voice Note to trigger DUE_NOW active alarm popup
    const testAlarmBtn = page.locator("button:has-text('Test Alarm')").first();
    if (await testAlarmBtn.isVisible()) {
      await testAlarmBtn.click();
    }

    // 5. Verify Active Alarm Modal is visible
    const alarmModal = page.locator("text=MEDICINE ALARM DUE NOW").first();
    await expect(alarmModal).toBeVisible({ timeout: 10000 });

    // 6. Click Snooze 15m button
    const snoozeBtn = page.locator("button:has-text('Snooze')").first();
    await expect(snoozeBtn).toBeVisible();
    await snoozeBtn.click();

    // 7. Verify alarm modal closes or updates status to Snoozed
    await expect(alarmModal).not.toBeVisible();
  });
});
