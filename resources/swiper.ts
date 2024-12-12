import type { Resource } from '.'
import { formatLink, getPropValue } from '~/lib/docs'

export const swiper: Resource = {
  type: 'swiper',
  label: 'Swiper',
  icon: '/resources/swiper.svg',
  site: 'https://swiperjs.com/',
  git: 'https://github.com/nolimits4web/swiper-website.git',
  docsPath: 'src/pages',
  ignore: ['blog', 'changelog'],
  getLink: ({ path }) => formatLink(swiper.site, path.replace(swiper.docsPath, '')),
  formatTitle: ({ path, doc }) => {
    const title = getPropValue(doc, 'title')

    if (!title) {
      throw new Error(`[${swiper.label}]: No title in ${path}`)
    }

    return title
  },
}
