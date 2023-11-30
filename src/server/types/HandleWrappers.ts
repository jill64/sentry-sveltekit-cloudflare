import { Handle, HandleServerError } from '@sveltejs/kit'
import { Captured } from '../../common/types/Captured.js'

export type HandleWrappers = {
  onHandle: (handle?: Handle) => Handle
  onError: Captured<HandleServerError>
}
