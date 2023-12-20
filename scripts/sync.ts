import { exec } from 'node:child_process'
import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const source = path.join(__dirname, '../node_modules/@sentry/sveltekit')
const dest = path.join(__dirname, '../src/sentry-sveltekit')

await rm(dest, { recursive: true, force: true })
await cp(source, dest, {
  recursive: true,
  dereference: true,
  force: true
})

// remove version from package.json to avoid conflicts
const filepath = path.join(dest, 'package.json')
const packageJson = await readFile(filepath, 'utf-8')
const json = JSON.parse(packageJson)
await writeFile(
  filepath,
  JSON.stringify({ ...json, version: undefined }, null, 2)
)

// Refresh workspace dependencies
await promisify(exec)('pnpm i --no-frozen-lockfile')
