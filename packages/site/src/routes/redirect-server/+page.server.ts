import { PREVIEW_AUTH_TOKEN } from '$env/static/private'
import { redirect } from '@sveltejs/kit'

export const load = () => {
  throw redirect(302, `/?token=${PREVIEW_AUTH_TOKEN}`)
}
