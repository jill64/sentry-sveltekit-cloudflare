import { build } from 'esbuild'

const opts = {
  bundle: true,
  minify: true,
  format: 'esm'
} as const

build({
  ...opts,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  external: ['$app/*', 'toucan-js']
})

build({
  ...opts,
  entryPoints: ['src/client/index.ts'],
  outfile: 'dist/client/index.js',
  external: ['$app/*']
})

build({
  ...opts,
  entryPoints: ['src/server/index.ts'],
  outfile: 'dist/server/index.js',
  external: ['$app/*', 'toucan-js']
})
