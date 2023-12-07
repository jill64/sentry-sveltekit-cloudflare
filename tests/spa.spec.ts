import { expect, test } from '@playwright/test'

test('SPA', async ({ page }) => {
  await page.goto('/csr')
  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()

  await page.getByRole('link', { name: '/' }).click()

  await expect(page.getByText('Load at ')).toBeVisible()
})

test('SPA Throw', async ({ page }) => {
  await page.goto('/throw/layout/server-load')

  await expect(page.getByRole('heading', { name: 'Error Page' })).toBeVisible()
  await expect(page.getByText('EventId: undefined')).not.toBeVisible()
})
