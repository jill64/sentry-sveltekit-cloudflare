const routes = [
  '/unknown-route',
  '/throw/load',
  '/throw/server-load',
  '/throw/layout/load',
  '/throw/layout/server-load',
  '/csr',
  '/ssg',
  '/redirect-server'
]

export const load = ({ data }) => {
  return {
    ...data,
    routes
  }
}
