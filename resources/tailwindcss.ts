import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDashFromPath } from '~/lib/docs'

export const tailwindcss: Resource = {
  type: 'tailwindcss',
  label: 'Tailwind CSS',
  icon: '/resources/tailwindcss.svg',
  site: 'https://tailwindcss.com',
  git: 'https://github.com/tailwindlabs/tailwindcss.com.git',
  docsPath: 'content',
  ignore: [
  ],
  getLink: ({ path }) =>
    formatLink(tailwindcss.site, `/docs/${removeNumbersWithDashFromPath(path.replace(tailwindcss.docsPath, ''))}`),
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${tailwindcss.label}]: No title in ${path}`)
    }

    return title
  },
}
