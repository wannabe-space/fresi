import type { docType } from '~/drizzle'
import { betterAuth } from './better-auth'
import { drizzleOrm } from './drizzle-orm'
import { hono } from './hono'
import { next } from './next'
import { nuxt } from './nuxt'
import { prisma } from './prisma'
import { react } from './react'
import { svelte } from './svelte'
import { swiper } from './swiper'
import { tanstackQuery } from './tanstack-query'
import { tanstackRouter } from './tanstack-router'
import { vue } from './vue'

export type DocType = (typeof docType.enumValues)[number]

export interface Resource {
  type: DocType
  label: string
  icon: string
  site: string
  git: string
  getLink: (props: { path: string, doc: string }) => string
  formatTitle: (props: { path: string, doc: string }) => string
  ignore: string[]
  category: 'frontend' | 'backend' | 'fullstack' | 'database' | 'service'
  docsPath: string
}

export const resources: Resource[] = [
  react,
  vue,
  svelte,
  next,
  nuxt,
  hono,
  tanstackQuery,
  tanstackRouter,
  swiper,
  drizzleOrm,
  prisma,
  betterAuth,
]
