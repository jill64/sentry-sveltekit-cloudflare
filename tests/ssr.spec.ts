import { expect, test } from '@playwright/test'

test('SSR', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()
})
