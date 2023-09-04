const routes = [
  '/unknown-route',
  '/throw/load',
  '/throw/server-load',
  '/throw/layout/load',
  '/throw/layout/server-load',
  '/csr',
  '/pre-rendered',
  '/redirect-server'
]

export const load = ({ data }) => {
  return {
    ...data,
    routes
  }
}
