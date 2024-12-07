import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes } from '~/lib/docs'

export const mdn: Resource = {
  // eslint-disable-next-line ts/no-explicit-any
  type: 'mdn' as any,
  label: 'MDN',
  icon: '/resources/mdn.svg',
  category: 'service',
  site: 'https://developer.mozilla.org',
  git: 'https://github.com/mdn/content.git',
  docsPath: 'files/en-us',
  ignore: [
    'en-us/webassembly',
    'en-us/related',
    'en-us/mozilla',
    'en-us/mdn',
    'en-us/glossary',
    'en-us/games',
    'en-us/web/guide',
    'en-us/web/opensearch',
    'en-us/web/privacy',
    'en-us/web/tutorials',
    'en-us/web/webdriver',
    'en-us/web/xpath',
    'en-us/web/xslt',
  ],
  getLink: ({ doc }) => {
    const slug = getPropValueBetweenDashes(doc, 'slug')

    if (!slug) {
      throw new Error(`[MDN]: No slug in ${doc}`)
    }

    return formatLink(mdn.site, `en-US/docs/${slug}`)
  },
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${mdn.label}]: No title in ${path}`)
    }

    return title
  },
}
