import { expect, test as setup } from '@playwright/test'
import { config } from 'dotenv'

config()

const authFile = 'playwright/.auth/user.json'

const env = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`)
  }
  return value
}

setup('authenticate', async ({ page }) => {
  await page.goto('/')
  await page
    .getByLabel('Username or email address')
    .fill(env('PLAYRIGHT_GITHUB_EMAIL'))
  await page.getByLabel('Password').fill(env('PLAYRIGHT_GITHUB_PASSWORD'))
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.waitForURL('/')

  await expect(
    page.getByRole('heading', { name: 'sentry-sveltekit-cloudflare' })
  ).toBeVisible()

  await page.context().storageState({ path: authFile })
})
