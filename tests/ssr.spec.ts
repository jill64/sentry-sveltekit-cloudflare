import { expect, test } from '@playwright/test'

test('SSR', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()
})

test('SSR Throw', async ({ page }) => {
  await page.goto('/throw/server-load')

  await expect(page.getByRole('heading', { name: 'Error Page' })).toBeVisible()
  await expect(page.getByText('EventId: undefined')).not.toBeVisible()
})
