import { router } from '~/trpc'
import { create } from './create'
import { get } from './get'
import { list } from './list'
import { remove } from './remove'
import { visibility } from './visibility'

export const chatsRouter = router({
  get,
  list,
  remove,
  create,
  visibility,
})
