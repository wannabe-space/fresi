import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDashFromPath } from '~/lib/docs'

export const next: Resource = {
  type: 'next',
  label: 'Next.js',
  icon: '/resources/next.svg',
  site: 'https://nextjs.org',
  git: 'https://github.com/vercel/next.js.git',
  docsPath: 'docs',
  ignore: [
    'conferences.md',
    'content/community',
    'content/errors',
    'blog',
  ],
  getLink: ({ path }) => formatLink(next.site, removeNumbersWithDashFromPath(path)),
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${next.label}]: No title in ${path}`)
    }

    return title
  },
}
