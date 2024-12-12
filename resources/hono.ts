import type { Resource } from '.'
import { formatLink, getFirstHeadingAsTitle } from '~/lib/docs'

export const hono: Resource = {
  type: 'hono',
  label: 'Hono',
  icon: '/resources/hono.png',
  site: 'https://hono.dev',
  git: 'https://github.com/honojs/website.git',
  docsPath: 'docs',
  ignore: [],
  getLink: ({ path }) => formatLink(hono.site, path),
  formatTitle: ({ path, doc }) => {
    const title = getFirstHeadingAsTitle(doc)

    if (!title) {
      throw new Error(`[${hono.label}]: No title in ${path}`)
    }

    return title
  },
}
