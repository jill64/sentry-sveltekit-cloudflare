import { expect, test } from '@playwright/test'

test('SPA', async ({ page }) => {
  await page.goto('/csr')
  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()

  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()
})
