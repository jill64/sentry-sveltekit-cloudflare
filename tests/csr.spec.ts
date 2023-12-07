import { expect, test } from '@playwright/test'

test('CSR', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()

  await page.getByRole('link', { name: '/csr' }).click()

  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()
})

test('CSR Throw', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()

  await page.getByRole('link', { name: '/throw/layout/load' }).click()

  await expect(page.getByRole('heading', { name: 'Error Page' })).toBeVisible()
  await expect(page.getByText('EventId: undefined')).not.toBeVisible()
})
