import { expect, test } from '@playwright/test'

test('CSR', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()

  await page.goto('/csr')

  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()
})
