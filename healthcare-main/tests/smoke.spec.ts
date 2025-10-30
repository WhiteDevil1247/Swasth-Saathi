import { test, expect } from '@playwright/test';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

test('frontend loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Health|Care/i);
});

test('backend health', async ({ request }) => {
  const res = await request.get(`${API}/health`);
  expect(res.ok()).toBeTruthy();
});

test('upload and list', async ({ page }) => {
  await page.goto('/healthvault');
  const filePath = 'tests/fixtures/sample.txt';
  await page.setInputFiles('#hv-file', filePath);
  await page.click('text=Refresh');
  const count = await page.locator('ul li').count();
  expect(count).toBeGreaterThan(0);
});

test('signalling connects', async ({ page }) => {
  await page.goto('/signalling');
  await expect(page.locator('text=connected')).toBeVisible({ timeout: 10000 });
});
