import { expect, test } from '@playwright/test'
import 'dotenv/config'

const param = `?token=${process.env.PREVIEW_AUTH_TOKEN}`

test('Top', async ({ page }) => {
  await page.goto(`/${param}`)
  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()
})

test('SPA', async ({ page }) => {
  await page.goto(`/csr${param}`)
  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()
})

test('CSR', async ({ page }) => {
  await page.goto(`/csr${param}`)
  await expect(page.getByRole('heading', { name: 'CSR' })).toBeVisible()
})

test('SSG', async ({ page }) => {
  await page.goto(`/ssg${param}`)
  await expect(page.getByRole('heading', { name: 'SSG' })).toBeVisible()
})
