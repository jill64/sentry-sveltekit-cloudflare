import esbuild from 'esbuild'

const build = (path: string, external?: string[]) =>
  esbuild.build({
    entryPoints: [`src/${path}.ts`],
    outfile: `dist/${path}.js`,
    bundle: true,
    minify: true,
    format: 'esm',
    external: ['$app/*', ...(external ?? [])]
  })

build('index', ['toucan-js'])
build('index-dev', ['toucan-js'])
build('client/index')
build('client/index-dev')
build('server/index', ['toucan-js'])
build('server/index-dev', ['toucan-js'])
