import { cache } from 'react'
import { createContext } from './context'
import { createCaller } from './routers'
import 'server-only'

const createTRPCContext = cache(() => createContext())

export const trpc = createCaller(createTRPCContext)
