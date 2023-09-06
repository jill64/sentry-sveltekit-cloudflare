import { build } from 'esbuild'

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: '../../dist/index.js',
  minify: true,
  format: 'esm',
  external: ['esm-env']
})
