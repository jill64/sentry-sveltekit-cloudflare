export const isRedirect = (error: unknown) => {
  if (error == null || typeof error !== 'object') {
    return false
  }

  const hasValidLocation =
    'location' in error && typeof error.location === 'string'

  const hasValidStatus =
    'status' in error &&
    typeof error.status === 'number' &&
    error.status >= 300 &&
    error.status <= 308

  return hasValidLocation && hasValidStatus
}
