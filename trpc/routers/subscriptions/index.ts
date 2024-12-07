import { router } from '~/trpc'
import { check } from './check'
import { manage } from './manage'

export const subscriptionsRouter = router({
  check,
  manage,
})
