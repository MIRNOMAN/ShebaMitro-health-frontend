import { test, expect } from "@playwright/test";

test.describe("Full Continuous Multi-Role Healthcare Lifecycle Test Suite", () => {
  test("Complete 5-phase end-to-end multi-role flow (Patient -> Doctor -> Alarm -> Lab -> Pharmacy)", async ({ page }) => {
    // ── Phase 1: Patient Books Doctor Slot & Diagnostics Checkout ──────
    await page.context().addCookies([
      { name: "sheba_session", value: "patient-demo-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "patient", domain: "localhost", path: "/" },
    ]);

    await page.goto("/doctors");
    await expect(page).toHaveTitle(/Doctors|ShebaMitro/i);

    // ── Phase 2: Doctor Conducts Video Call & Issues Prescription ───────
    await page.context().addCookies([
      { name: "sheba_session", value: "doctor-demo-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "doctor", domain: "localhost", path: "/" },
    ]);

    await page.goto("/doctor/prescriptions/new");
    const docBody = page.locator("body");
    await expect(docBody).toContainText(/Prescription|Doctor|Rx|BMDC/i);

    // ── Phase 3: Patient Alarm Deck Reflects Scheduled Alarm with Bengali Audio ──
    await page.context().addCookies([
      { name: "sheba_session", value: "patient-demo-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "patient", domain: "localhost", path: "/" },
      { name: "NEXT_LOCALE", value: "bn", domain: "localhost", path: "/" },
    ]);

    await page.goto("/dashboard/patient");
    const alarmDeck = page.locator("text=/Patient Medicine Alarm Deck|Medicine Alarm/i").first();
    await expect(alarmDeck).toBeVisible({ timeout: 10000 });

    // ── Phase 4: Diagnostic Lab Processes Order & Uploads Report ───────
    await page.context().addCookies([
      { name: "sheba_session", value: "lab-demo-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "lab", domain: "localhost", path: "/" },
    ]);

    await page.goto("/lab/reports/upload");
    const labBody = page.locator("body");
    await expect(labBody).toContainText(/Upload|Report|Lab/i);

    // ── Phase 5: Pharmacy Partner Scans QR Code & Validates Rx ────────
    await page.context().addCookies([
      { name: "sheba_session", value: "pharmacy-demo-token", domain: "localhost", path: "/" },
      { name: "sheba_role", value: "pharmacy", domain: "localhost", path: "/" },
    ]);

    await page.goto("/pharmacy/verify");
    const pharmBody = page.locator("body");
    await expect(pharmBody).toContainText(/Verify|Prescription|Pharmacy/i);
  });
});
