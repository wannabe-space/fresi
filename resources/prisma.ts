import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDashFromPath } from '~/lib/docs'

export const prisma: Resource = {
  type: 'prisma',
  label: 'Prisma',
  icon: '/resources/prisma.svg',
  site: 'https://prisma.io',
  git: 'https://github.com/prisma/docs.git',
  docsPath: 'content',
  ignore: [
    '300-accelerate',
    '400-pulse',
    '500-platform',
  ],
  getLink: ({ path }) =>
    formatLink(prisma.site, `/docs/${removeNumbersWithDashFromPath(path.replace(prisma.docsPath, ''))}`),
  formatTitle: ({ path, doc }) => {
    if (path.includes('700-optimize/index.mdx')) {
      return 'Optimize'
    }

    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${prisma.label}]: No title in ${path}`)
    }

    return title
  },
}
