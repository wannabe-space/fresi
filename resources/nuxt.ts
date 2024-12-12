import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDotFromPath } from '~/lib/docs'

export const nuxt: Resource = {
  type: 'nuxt',
  label: 'Nuxt',
  icon: '/resources/nuxt.svg',
  site: 'https://nuxt.com',
  git: 'https://github.com/nuxt/nuxt.git',
  docsPath: 'docs',
  ignore: [
    'README.md',
    '2.guide/2.guide/0.index.md',
    '2.guide/3.going-further/index.md',
    '3.api/index.md',
    '5.community',
  ],
  getLink: ({ path }) =>
    formatLink(nuxt.site, removeNumbersWithDotFromPath(path)),
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${nuxt.label}]: No title in ${path}`)
    }

    return title
  },
}
