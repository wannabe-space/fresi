import type { Resource } from '.'
import { formatLink, getFirstHeadingAsTitle, getPropValueBetweenDashes } from '~/lib/docs'

export const drizzleOrm: Resource = {
  type: 'drizzle-orm',
  label: 'Drizzle ORM',
  icon: '/resources/drizzle-orm.svg',
  category: 'database',
  site: 'https://orm.drizzle.team',
  git: 'https://github.com/drizzle-team/drizzle-orm-docs.git',
  docsPath: 'src/content/docs',
  ignore: [
    'latest-releases',
    'd1-existing',
    'goodies',
    'gotchas',
    'guides',
    'tutorials',
    'upgrade-21',
    'seed-limitations',
  ],
  getLink: ({ path }) =>
    formatLink(drizzleOrm.site, path.replace(drizzleOrm.docsPath, 'docs/')),
  formatTitle: ({ path, doc }) => {
    if (path.includes('migrate/components.mdx')) {
      return 'Migrate Components'
    }

    const title = getPropValueBetweenDashes(doc, 'title') || getFirstHeadingAsTitle(doc)

    if (!title) {
      throw new Error(`[${drizzleOrm.label}]: No title in ${path}`)
    }

    return title
  },
}
