import { build } from 'esbuild'

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  outfile: '../../dist/index.js',
  format: 'esm',
  external: [
    '@sveltejs/kit',
    'toucan-js',
    'esm-env',
    '@sentry/core',
    '@sentry/utils'
  ]
})
