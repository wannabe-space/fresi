import type { Resource } from '.'
import { formatLink, getFirstHeadingAsTitle } from '~/lib/docs'

export const vue: Resource = {
  type: 'vue',
  label: 'Vue',
  icon: '/resources/vue.svg',
  category: 'frontend',
  site: 'https://vuejs.org',
  git: 'https://github.com/vuejs/docs.git',
  docsPath: 'src',
  ignore: [
    'src/about',
    'src/partners',
    'src/sponsor',
    'src/translations',
    'src/api/index.md',
    'src/developers',
    'src/ecosystem',
    'src/examples',
    'src/index.md',
    'src/tutorial',
  ],
  getLink: ({ path }) =>
    formatLink(vue.site, path.replace(vue.docsPath, '')),
  formatTitle: ({ path, doc }) => {
    const title = getFirstHeadingAsTitle(doc)

    if (!title) {
      throw new Error(`[${vue.label}]: No title in ${path}`)
    }

    return title
  },
}
