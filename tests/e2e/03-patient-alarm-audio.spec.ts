import { test, expect } from "@playwright/test";

test.describe("Multi-Role Lifecycle Phase 3: Patient Dashboard Scheduled Alarm & Bengali Audio Trigger", () => {
  test.beforeEach(async ({ page }) => {
    // Set Patient RBAC Session Cookie & preferred language 'bn'
    await page.context().addCookies([
      { name: "sheba_session", value: "patient-session-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "patient", domain: "localhost", path: "/" },
      { name: "NEXT_LOCALE", value: "bn", domain: "localhost", path: "/" },
      { name: "shebamitro_locale", value: "bn", domain: "localhost", path: "/" },
    ]);
  });

  test("Patient dashboard should display scheduled medicine alarms and trigger Bengali audio voice player", async ({ page }) => {
    await page.goto("/dashboard/patient");

    // 1. Verify Patient Medicine Alarm Deck Header
    const alarmDeckHeader = page.locator("text=/Patient Medicine Alarm Deck|Medicine Alarm/i").first();
    await expect(alarmDeckHeader).toBeVisible({ timeout: 10000 });

    // 2. Click Test Alarm Voice Note to trigger alarm modal popup
    const testAlarmBtn = page.locator("button:has-text('Test Alarm'), button:has-text('Test Voice')").first();
    if (await testAlarmBtn.isVisible()) {
      await testAlarmBtn.click();
    }

    // 3. Verify Active Alarm Modal
    const alarmModal = page.locator("text=/MEDICINE ALARM DUE NOW|ওষুধ খাওয়ার সময় হয়েছে/i").first();
    await expect(alarmModal).toBeVisible({ timeout: 10000 });

    // 4. Verify Bengali Audio Voice Player Component
    const voicePlayer = page.locator("text=/বাংলা ভয়েস|Bengali Audio Player|ভয়েস বার্তা/i").first();
    await expect(voicePlayer).toBeVisible({ timeout: 10000 });

    // 5. Click Replay Voice Note Button
    const replayBtn = page.locator("button:has-text('পুনরায় শুনুন'), button:has-text('Replay')").first();
    if (await replayBtn.isVisible()) {
      await replayBtn.click();
    }

    // 6. Click Take Now to mark dosage taken
    const takeNowBtn = page.locator("button:has-text('Take Now'), button:has-text('এখনই সেবন করুন')").first();
    await expect(takeNowBtn).toBeVisible();
    await takeNowBtn.click();

    // 7. Verify modal closes
    await expect(alarmModal).not.toBeVisible();
  });
});
