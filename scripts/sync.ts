import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { dependencies } from '../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const version = dependencies['@sentry/svelte']

const dest = path.join(__dirname, '../src/sentry-javascript')
const cwd = path.join(__dirname, '../src')

if (existsSync(dest)) {
  console.log('sentry-javascript already exists, skipping')
  process.exit(0)
}

await rm(dest, { recursive: true, force: true })

await promisify(exec)(
  `git clone https://github.com/getsentry/sentry-javascript.git --depth 1 -b ${version}`,
  { cwd }
)
