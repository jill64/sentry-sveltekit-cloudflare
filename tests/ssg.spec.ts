import { expect, test } from '@playwright/test'

test('SSG', async ({ page }) => {
  await page.goto('/ssg')
  await expect(page.getByRole('heading', { name: 'SSG' })).toBeVisible()

  await page.goto('/')
  await expect(page.getByText('Load at ')).toBeVisible()
})
