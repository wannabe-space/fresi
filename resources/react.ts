import type { Resource } from '.'
import { formatLink, getPropValueBetweenDashes } from '~/lib/docs'

export const react: Resource = {
  type: 'react',
  label: 'React',
  icon: '/resources/react.svg',
  category: 'frontend',
  site: 'https://react.dev',
  git: 'https://github.com/reactjs/react.dev.git',
  docsPath: 'src/content',
  ignore: [
    'conferences.md',
    'content/community',
    'content/errors',
    'blog',
  ],
  getLink: ({ path }) =>
    formatLink(react.site, path.replace(react.docsPath, '')),
  formatTitle: ({ path, doc }) => {
    if (path.endsWith('src/content/reference/react-dom/components/link.md'))
      return '<link>'

    if (path.endsWith('src/content/reference/react-dom/components/meta.md'))
      return '<meta>'

    if (path.endsWith('src/content/reference/react-dom/components/script.md'))
      return '<script>'

    if (path.endsWith('src/content/reference/react-dom/components/style.md'))
      return '<style>'

    const title = getPropValueBetweenDashes(doc, 'title')

    if (!title) {
      throw new Error(`[${react.label}]: No title in ${path}`)
    }

    return title
  },
}
