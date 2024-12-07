import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes } from '~/lib/docs'

export const tanstackRouter: Resource = {
  type: 'tanstack-router',
  label: 'TanStack Router',
  icon: '/resources/tanstack.svg',
  category: 'frontend',
  site: 'https://tanstack.com',
  git: 'https://github.com/TanStack/router.git',
  docsPath: 'docs',
  ignore: [],
  getLink: ({ path, doc }) => {
    const ref = getPropValueBetweenDashes(doc, 'ref')
    const localPath = ref || path

    return formatLink(tanstackRouter.site, `/router/latest/${localPath}`)
  },
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${tanstackRouter.label}]: No title in ${path}`)
    }

    return title
  },
}
