import type { Handle, HandleServerError } from '@sveltejs/kit'
import type { Captured } from '../../types/Captured.js'

export type HandleWrappers = {
  onHandle: (handle?: Handle) => Handle
  onError: Captured<HandleServerError>
}
