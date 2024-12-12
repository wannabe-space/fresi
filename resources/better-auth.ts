import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes } from '~/lib/docs'

export const betterAuth: Resource = {
  type: 'better-auth',
  label: 'Better Auth',
  icon: '/resources/better-auth.svg',
  site: 'https://better-auth.com',
  git: 'https://github.com/better-auth/better-auth.git',
  docsPath: 'docs/content/docs',
  ignore: [],
  getLink: ({ path }) =>
    formatLink(betterAuth.site, path.replace(betterAuth.docsPath, 'docs/')),
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${betterAuth.label}]: No title in ${path}`)
    }

    return title
  },
}
