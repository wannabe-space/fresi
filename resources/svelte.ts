import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes, removeNumbersWithDashFromPath } from '~/lib/docs'

export const svelte: Resource = {
  type: 'svelte',
  label: 'Svelte',
  icon: '/resources/svelte.svg',
  category: 'frontend',
  site: 'https://svelte.dev/',
  git: 'https://github.com/sveltejs/svelte.git',
  docsPath: 'documentation/docs',
  ignore: [
    '98-reference/.generated',
  ],
  getLink: ({ path }) => {
    const localPath = removeNumbersWithDashFromPath(path.replace(svelte.docsPath, ''))
      .split('/')
      .slice(2) // remove first `/` and first part of the path due to svelte do not use it in url
      .join('/')

    return formatLink(svelte.site, `docs/svelte/${localPath}`)
  },
  formatTitle: ({ path, doc }) => {
    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${svelte.label}]: No title in ${path}`)
    }

    return title
  },
}
