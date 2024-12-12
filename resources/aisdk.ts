import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDashFromPath } from '~/lib/docs'

export const aisdk: Resource = {
  type: 'aisdk',
  label: 'AI SDK',
  icon: '/resources/aisdk.svg',
  site: 'https://sdk.vercel.ai/',
  git: 'https://github.com/vercel/ai.git',
  docsPath: 'content/docs',
  ignore: [],
  getLink: ({ path }) => formatLink(aisdk.site, removeNumbersWithDashFromPath(path).replace('content/docs', 'docs')),
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${aisdk.label}]: No title in ${path}`)
    }

    return title
  },
}
