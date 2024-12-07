import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes } from '~/lib/docs'

export const tanstackQuery: Resource = {
  type: 'tanstack-query',
  label: 'TanStack Query',
  icon: '/resources/tanstack.svg',
  category: 'frontend',
  site: 'https://tanstack.com',
  git: 'https://github.com/TanStack/query.git',
  docsPath: 'docs',
  ignore: [
    'community',
  ],
  getLink: ({ path, doc }) => {
    const ref = getPropValueBetweenDashes(doc, 'ref')
    const localPath = ref || path

    return formatLink(tanstackQuery.site, `/query/latest/${localPath}`)
  },
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${tanstackQuery.label}]: No title in ${path}`)
    }

    return title
  },
}
