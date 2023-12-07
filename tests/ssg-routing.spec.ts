import { expect, test } from '@playwright/test'

test('SSG Routing', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()

  await page.getByRole('link', { name: '/ssg' }).click()
  await expect(page.getByRole('heading', { name: 'SSG' })).toBeVisible()
})
